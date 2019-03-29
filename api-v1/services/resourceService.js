const Security = require('./securityService');
const rdf = require('rdf-ext');
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

    }

    async create(req){
        let {headers, body, params} = req;
        let type = params.type;
        let userId = "";

        if (headers.authorization) {
          userId = headers.authorization.replace('Bearer ', '');
        } else {
            return {error:'Bad request', error_status:400, error_description:'Incorrect ID'}
        }
        //TODO: Resource verification and validation
        let resource = body;
        //TODO: Verify if graph exists, if not, see if user can create it 
        let graph = this.client.graph(type);
        //TODO: Verify user ID (token)
        let accorded = await this.userPerms.hasTypePermission(userId, type, 'Create');
        if (accorded == true){
            let resourceDefault = await jsonLDToDataset(resource)
            let current_date = Date.now();
            //Generate ID
            let id = crypto.randomBytes(3).toString('hex') + current_date;
            let subject = graph.value + '/' + id
            //Remaps the subject to semapps subject (?)
            let resourceIdentified = resourceDefault.map(q => {
                return rdf.quad(rdf.namedNode(subject), q.predicate, q.object, graph)
            })
            let resourceUri = req.protocol + '://' + req.get('host') + req.originalUrl;
            let uri = resourceUri.replace('new', `${id}`)
            //Add permissions
            let perm = this.userPerms.createNewPermResource(userId, subject, type);
            let output = serializer.import(resourceIdentified.toStream());
            try {
                //Creates the resource
                this.store.import(resourceIdentified.toStream());
            } catch (error) {
                return {error:'Bad Request', error_status:400, error_description:'Incorrect info'}
            }
            return new Promise((resolve, reject) => {
                perm.then(() => {
                    output.on('data', jsonld => {
                        log(`New resource created : ${uri}`);
                        resolve({uri:uri, id:id});
                    })
                })
            });
        }
        return {error:'Forbidden', error_status:403, error_description:'Permission denied'}
    }

    async edit(req){
        let {headers, body, params} = req;
        let {type, id} = params;
        let userId = "";

        if (headers.authorization) {
          userId = headers.authorization.replace('Bearer ', '');
        } else {
            return {error:'Bad request', error_status:400, error_description:'Incorrect ID'}
        }
        //TODO: Resource verification and validation
        let resource = body;
        //TODO: Verify if graph exists, if not, see if user can create it 
        let graph = this.client.graph(type);
        let resourceUri = rdf.namedNode(graph.value + '/' + id);

        //TODO: Verify user ID (token)
        let accorded = await this.userPerms.hasPermission(userId, resourceUri, type, 'Edit');
        if (accorded == true){
            let resourceDefault = await jsonLDToDataset(resource)
            //Remaps the resourceUri to semapps resourceUri (?)
            let resourceIdentified = resourceDefault.map(q => {
                return rdf.quad(rdf.namedNode(resourceUri), q.predicate, q.object, graph)
            })

            let oldResourceStream = this.store.match(resourceUri, null, null, graph);
            let oldResource = await rdf.dataset().import(oldResourceStream);
            
            let toRemove = oldResource.difference(resourceIdentified);
            

            let resourcePath = req.protocol + '://' + req.get('host') + req.originalUrl;
            let uri = resourcePath.replace('new', `${id}`)
            // let perm = this.userPerms.createNewPermResource(userId, resourceUri, type);
            let output = serializer.import(resourceIdentified.toStream());
            try {
                //Creates the resource
                this.store.import(resourceIdentified.toStream());
                //Removes the triples
                this.store.remove(toRemove.toStream())

            } catch (error) {
                return {error:'Bad Request', error_status:400, error_description:'Incorrect info'}
            }
            return new Promise((resolve, reject) => {
                // perm.then(() => {
                    output.on('data', jsonld => {
                        log(`Edited resource : ${uri}`);
                        resolve({uri:uri, id:id});
                    })
                // })
            });
        }
        return {error:'Forbidden', error_status:403, error_description:'Permission denied'}

    }

    async delete(req){
        let {headers, body, params} = req;
        let {type, id} = params;
        let userId = "";

        if (headers.authorization) {
          userId = headers.authorization.replace('Bearer ', '');
        } else {
            return {error:'Bad request', error_status:400, error_description:'Incorrect ID'}
        }
        //TODO: Resource verification and validation
        let resource = body;
        //TODO: Verify if graph exists, if not, see if user can create it 
        let graph = this.client.graph(type);
        let resourceUri = rdf.namedNode(graph.value + '/' + id);

        //TODO: Verify user ID (token)
        let accorded = await this.userPerms.hasPermission(userId, resourceUri, type, 'Delete');
        if (accorded == true){
            let resourceDefault = await jsonLDToDataset(resource)
            //Remaps the resourceUri to semapps resourceUri (?)
            let resourceIdentified = resourceDefault.map(q => {
                return rdf.quad(rdf.namedNode(resourceUri), q.predicate, q.object, graph)
            })

            let oldResourceStream = this.store.match(resourceUri, null, null, graph);
            let oldResource = await rdf.dataset().import(oldResourceStream);
            
            let toRemove = oldResource.difference(resourceIdentified);
            
            console.log('toRemove :', toRemove)
            let resourcePath = req.protocol + '://' + req.get('host') + req.originalUrl;
            let uri = resourcePath.replace('new', `${id}`)
            // let perm = this.userPerms.createNewPermResource(userId, resourceUri, type);
            let output = serializer.import(resourceIdentified.toStream());
            try {
                //Creates the resource
                // this.store.import(resourceIdentified.toStream());
                //Removes the triples
                // this.store.remove(toRemove.toStream())

            } catch (error) {
                return {error:'Bad Request', error_status:400, error_description:'Incorrect info'}
            }
            return new Promise((resolve, reject) => {
                // perm.then(() => {
                    output.on('data', jsonld => {
                        log(`Edited resource : ${uri}`);
                        resolve({uri:uri, id:id});
                    })
                // })
            });
        }
        return {error:'Forbidden', error_status:403, error_description:'Permission denied'}

    }

    async getByType(headers, type){
        if(!type){
            return {error:'400'};
        } else {
            let userId;
            if (headers.authorization) {
                userId = headers.authorization.replace('Bearer ', '');
            } else {
                return {error:'Unauthorized', error_status:401, error_description:'Id token incorrect'}
            }

            let graphStream = this.store.match(null, null, null, this.client.graph(type));
            let graphQuads = await rdf.dataset().import(graphStream);

            let accorded = false;
            accorded = await this.userPerms.hasTypePermission(userId, type, 'Read');
            if (accorded == true){
                let output = serializer.import(graphQuads.toStream());
                return new Promise((resolve, reject) => {
                    output.on('data', jsonld => {
                        log(`Get resource graph`);
                        resolve(jsonld);
                    })
                });
            } else {
                //Check for individual permissions
                accordedQuads = [];
                let subj = "";
                graphQuads.forEach(quad => {
                })
            }
        }
    }

    async getById(headers, params){
        let {type, id} = params;
        let userId = "";

        if (headers.authorization) {
            userId = headers.authorization.replace('Bearer ', '');
        } else {
            return {error:'Unauthorized', error_status:401, error_description:'Id token incorrect'}
        }
        //TODO: verify if type exists
        let graph = this.client.graph(type);

        let resourceUri = rdf.namedNode(graph.value + '/' + id);
        let accorded = await this.userPerms.hasPermission(userId, resourceUri, type, 'Read');
        if (accorded == true){

            let matchStream = this.store.match(resourceUri, null, null);
            let match = await rdf.dataset().import(matchStream);
            
            let output = serializer.import(match.toStream());
            
            return new Promise((resolve, reject) => {
                output.on('data', jsonld => {
                    resolve(jsonld);
                })
            });
        }
        return {error:'Forbidden', error_status:403, error_description:'Permission denied'}
    }
    
}