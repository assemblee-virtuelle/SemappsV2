const Security = require('./securityService');
const JSONLDParser = require('@rdfjs/parser-jsonld');
const Readable = require('stream').Readable
const Serializer = require('@rdfjs/serializer-jsonld');
const rdf = require('rdf-ext');
const crypto = require('crypto');
const ns = require('../utils/namespaces')

const serializer = new Serializer();
const parserJsonld = new JSONLDParser();


module.exports = class {
    constructor(store){
        // //Initialize sparql client
        this.store = store.store;    
        this.sGraph = store.securityGraph();
        this.client = store;
        this.userPerms = new Security(this.client);

    }

    async create(req){
        let {headers, body} = req;
        let type = body.resourceType;

        let userId = "";

        if (headers.authorization) {
          userId = headers.authorization.replace('Bearer ', '');
        } else {
            return {error:'Bad request', error_status:400, error_description:'Incorrect ID'}
        }
        //TODO: Resource verification and validation
        let resource = body.resourceData;

        //TODO: Verify if graph exists, if not, see if user can create it 
        let graph = this.client.graph(type);

        //TODO: Verify user ID (token)
        //TODO: Verify user permissions
        let accorded = await this.userPerms.hasTypePermission(userId, type, 'Create');
        // let accorded = true;
        if (accorded == true){

            let resourceDefault = await this._jsonLDToDataset(resource)
            let current_date = Date.now();
            let id = crypto.randomBytes(3).toString('hex') + current_date;
            let subject = graph.value + '/' + id

            let resourceIdentified = resourceDefault.map(q => {
                return rdf.quad(rdf.namedNode(subject), q.predicate, q.object, graph)
            })

            try {
                this.store.import(resourceIdentified.toStream());
            } catch (error) {
                return {error:'Bad Request', error_status:400, error_description:'Incorrect info'}
            }

            let resourceUri = req.protocol + '://' + req.get('host') + req.originalUrl;
            let uri = resourceUri.replace('new', `${body.resourceType}/${id}`)
            
            //Add permissions
            let perm = this.userPerms.createNewResource(userId, subject, type);
            
            let output = serializer.import(resourceIdentified.toStream());

            return new Promise((resolve, reject) => {
                perm.then(() => {
                    output.on('data', jsonld => {
                        resolve({uri:uri});
                    })
                })
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

            let accorded = await this.userPerms.hasTypePermission(userId, type, 'Read');
            console.log('accorded :', accorded)
            if (accorded == true){

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
        console.log('accorded :', accorded)
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

    async _jsonLDToDataset(jsonld){
        const input = new Readable({
            read: () => {
                input.push(JSON.stringify(jsonld))
                input.push(null)
            }
        })
        const output = parserJsonld.import(input)
        let resourceDefault = await rdf.dataset().import(output)
        return resourceDefault;
    }
    
}