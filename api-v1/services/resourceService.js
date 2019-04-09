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
        let {body, params} = req;
        let resource = body;
        let graph = this.client.graph(params.type);
        let resourceDefault = await jsonLDToDataset(resource)
        
        //Generate ID
        let current_date = Date.now();
        let id = crypto.randomBytes(3).toString('hex') + current_date;
        let subject = graph.value + '/' + id;

        //Remaps the subject to semapps subject (?)
        let resourceIdentified = resourceDefault.map(q => {
            return rdf.quad(rdf.namedNode(subject), q.predicate, q.object, graph);
        })
        let uri = req.protocol + '://' + req.get('host') + req.originalUrl + id;

        //Import the data into the store
        let dataImport = this.store.import(resourceIdentified.toStream());

        //Add permissions
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
        console.log('id :', id)
        let graph = this.client.graph(params.type);
        let resource = body;

        let resourceUri = rdf.namedNode(graph.value + '/' + id);

        let resourceDefault = await jsonLDToDataset(resource)
        //Remaps the resourceUri to semapps resourceUri (?)
        let resourceIdentified = resourceDefault.map(q => {
            return rdf.quad(resourceUri, q.predicate, q.object, graph)
        })

        // console.log('resourceUri :', resourceIdentified)
        
        //Makes a new dataset with old quads
        let oldResourceStream = this.store.match(resourceUri, null, null, graph);
        // console.log('graph :', graph)
        let oldResource = await rdf.dataset().import(oldResourceStream);
        // let toRemove = oldResource.difference(resourceIdentified);

        let uri = req.protocol + '://' + req.get('host') + req.originalUrl;

        console.log('resourceIdentified :', resourceIdentified)
        //update triples
        // let removeStream = this.store.remove(toRemove.toStream());
        let importStream = this.store.import(resourceIdentified.toStream());

        return new Promise((resolve, reject) => {
            rdf.waitFor(importStream).then(() => {
                log(`Edited ${params.type} - uri: ${uri}`);
                resolve({uri:uri, id:id});
            })
        });

    }

    async delete(req){
        let {body, params} = req;
        let id = params.id;
        let resource = body;
        let graph = this.client.graph(params.type);
        let resourceUri = rdf.namedNode(graph.value + '/' + id);

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

        //Creates the resource
        // this.store.import(resourceIdentified.toStream());
        //Removes the triples
        // this.store.remove(toRemove.toStream())

        return new Promise((resolve, reject) => {
            rdf.waitFor(removeStream).then(() => rdf.waitFor(importStream)).then(() => {
                log(`Deleted ${params.type} - uri: ${uri}`);
                resolve({uri:uri, id:id});
            })
        });

    }

    async getByType(type){
        let graphStream = this.store.match(null, null, null, this.client.graph(type));
        let graphQuads = await rdf.dataset().import(graphStream);
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
        let matchStream = this.store.match(resourceUri, null, null);
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