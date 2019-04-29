const Security = require('./securityService');
const rdf = require('rdf-ext');
const ns = require('../utils/namespaces')
const Serializer = require('@rdfjs/serializer-jsonld');
const crypto = require('crypto');
const log = require('debug')('semapps:resource')
const jsonLDToDataset = require('../utils/jsontodataset');

const serializer = new Serializer();

module.exports = class {
    constructor(client){
        // //Initialize sparql client
        this.store = client.store;    
        this.sGraph = client.securityGraph();
        this.client = client;
        this.userPerms = new Security(this.client);
        //TODO: put this in config
        this.permissionsEnabled = true;

        this.defaultPermissions = ['Create', 'Read', 'Delete', 'Edit', 'Control'];
    }

    customQuads(method, userId, resourceId, type, options = {}){
        let resourceUri = this.client.graph(type).value + '/' + resourceId;
        let quads = [];
        switch(method){
            case 'create':
                quads.push(rdf.quad(this.userPerms._userUri(userId), ns.sioc('creator_of'), rdf.namedNode(resourceUri), this.sGraph));
                //TODO: move this into security 
                if (this.permissionsEnabled){
                    let newQuads = this.userPerms.createDefaultPermissions(resourceId, userId, [type], this.defaultPermissions)
                    quads = quads.concat(newQuads);
                }
                break;
            case 'edit':
                // if (this.permissionsEnabled){
                //     let quads = this.userPerms.editPermissions(resourceUri, userId, [type], this.defaultPermissions)
                //     quads.push(quads);
                // }
                break;
            case 'delete':
                if (this.permissionsEnabled){

                }
                break;
            default:
            break;
        }
        return quads;
    }

    async create(req){
        let {body, params} = req;
        let resource = body;
        let graph = this.client.graph(params.type);
        let resourceDefault = await jsonLDToDataset(resource)
        let id = "";

        //Generate ID
        let current_date = Date.now();
        id = crypto.randomBytes(3).toString('hex') + current_date;
        //TODO: un-hardcode this
        if (params.type === 'User'){
            // uri = req.protocol + '://' + req.get('host') + req.originalUrl + id;
            id = req.userId;
        }
        let uri = req.protocol + '://' + req.get('host') + req.originalUrl + '/' + id;
        let subject = graph.value + '/' + id;

        //Remaps the subject to semapps subject (?)
        let resourceIdentified = resourceDefault.map(q => {
            return rdf.quad(rdf.namedNode(subject), q.predicate, q.object, graph);
        })

        let customQuads = this.customQuads('create', req.userId, id, params.type);
        let resourceDataset = resourceIdentified.merge(rdf.dataset(customQuads));

        //Import the data into the store
        let dataImport = this.store.import(resourceDataset.toStream());
        
        return new Promise((resolve, reject) => {
            rdf.waitFor(dataImport).then(() => {
                log(`Created new ${params.type} - uri: ${uri}`);
                resolve({uri:uri, id:id});
            })
        });
    }

    async edit(req){
        let {body, params} = req;
        let id = params.id;
        let graph = this.client.graph(params.type);
        let resource = body;
        let resourceUri = rdf.namedNode(graph.value + '/' + id);
        let resourceDefault = await jsonLDToDataset(resource)
        //Remaps the resourceUri to semapps resourceUri (?)
        let resourceIdentified = resourceDefault.map(q => {
            return rdf.quad(resourceUri, q.predicate, q.object, graph)
        })
        //Makes a new dataset with old quads and filters the triples to remove
        let oldResourceStream = this.store.match(resourceUri, null, null, graph);
        let oldResource = await rdf.dataset().import(oldResourceStream);
        let toRemove = oldResource.filter(quad => {
            if (!resourceIdentified.includes(rdf.quad(quad.subject, quad.predicate, null, quad.graph))){
                return true;
            } else if(resourceIdentified.includes(rdf.quad(quad.subject, quad.predicate, quad.object, quad.graph))) {
                return false;
            } else {
                return true;
            }
        })

        //Generate frontend uri (TODO: change ?)
        let uri = req.protocol + '://' + req.get('host') + req.originalUrl;
        await this.store.remove(toRemove.toStream());
        return new Promise((resolve, reject) => {
            let stream = this.store.import(resourceIdentified.toStream())
            rdf.waitFor(stream).then(() => {
                log(`Edited ${params.type} - uri: ${uri}`);
                resolve({uri:uri, id:id});                            
            })
        });

    }

    async delete(req){
        let {params} = req;
        let id = params.id;
        let graph = this.client.graph(params.type);
        let resourceUri = rdf.namedNode(graph.value + '/' + id);
        let removeStream = this.store.removeMatches(resourceUri, null, null, graph);
        let uri = req.protocol + '://' + req.get('host') + req.originalUrl;
        return new Promise((resolve, reject) => {
            rdf.waitFor(removeStream).then(() => {
                log(`Deleted ${params.type} - uri: ${uri}`);
                resolve();
            })
        });
    }

    async _asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    async getByType(req){
        let type = req.params.type;
        let graph = this.client.graph(type);
        let graphQuads = rdf.dataset();

        if (this.permissionsEnabled){
            let authorizedUris = req.permList;
            if (authorizedUris !== undefined && authorizedUris.length !== 0){
                await this._asyncForEach(authorizedUris, async uri => {
                    let resourceStream = this.store.match(uri, null, null, graph);
                    let resourceQuads = await rdf.dataset().import(resourceStream);
                    graphQuads.addAll(resourceQuads);
                })
            }
        } else {
            let graphStream = this.store.match(null, null, null, graph);
            graphQuads = await rdf.dataset().import(graphStream);
        }
        
        if (graphQuads.length == 0){
            return {};
        }
        let output = serializer.import(graphQuads.toStream());
        return new Promise((resolve, reject) => {
            output.on('data', jsonld => {
                log(`Get list of ${type}`);
                resolve(jsonld);
            })
        });
    }

    async getById(params){
        let graph = this.client.graph(params.type);
        let resourceUri = rdf.namedNode(graph.value + '/' + params.id);
        let matchStream = this.store.match(resourceUri, null, null, graph);
        let match = await rdf.dataset().import(matchStream);
        let output = serializer.import(match.toStream());

        return new Promise((resolve, reject) => {
            output.on('data', jsonld => {
                log(`Get ${params.type} - uri: ${params.id}`);
                resolve(jsonld);
            })
        });
    }
    
}