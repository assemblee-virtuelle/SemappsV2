const bcrypt = require('bcrypt');
const Security = require('./securityService');
const rdf = require('rdf-ext');
const Serializer = require('@rdfjs/serializer-jsonld');
const ns = require('../utils/namespaces.js');
const Resource = require('./resourceService');
const serializer = new Serializer();
const crypto = require('crypto');

const jsonLDToDataset = require('../utils/jsontodataset')
const log = require('debug')('semapps:user');


module.exports = class {
  constructor(client){
    //Initialize sparql client
    
    this.store = client.store;    
    this.sGraph = client.securityGraph();
    this.client = client;
    this.userPerms = new Security(this.client);
    this.resource = new Resource(this.client);
    this.type = "User";
    this.uGraph = client.graph(this.type);

  }
  
  async userById(id){
    //FETCH USER INFO FROM ID
    let graph = this.client.graph(this.type);

    let subject = graph.value + '/' + id;
    let accorded = await this.userPerms.hasPermission(id, subject, this.type, 'Read')
    let user = "";
    if (accorded == true){
      const stream = this.store.match(rdf.namedNode(subject), null, null, this.uGraph);
      user = await rdf.dataset().import(stream);
      
      return new Promise((resolve, reject) => {
        let output = serializer.import(user.toStream());
        output.on('data', jsonld => {
          resolve(jsonld);
        })
      })
    }
    return {error:'Unauthorized', error_status:403, error_description:`Unauthorized to access ${subject}`};
  }

  //TODO: import mail address and stuff wanted from UserSecurity graph
  async create(req){
    let {headers, body} = req;
    let userId = "";
    let resource = body;
    let type = 'User';

    if (headers.authorization) {
      userId = headers.authorization.replace('Bearer ', '');
    } else {
        return {error:'Bad request', error_status:400, error_description:'Incorrect ID'}
    }
    
    let accorded = await this.userPerms.hasTypePermission(userId, this.type, 'Create');
    let subject = this.uGraph.value + '/' + userId;
    
    if (accorded == true){
      let resourceDefault = await jsonLDToDataset(resource);
      //Remaps the subject to semapps subject (?)
      let resourceIdentified = resourceDefault.map(q => {
          return rdf.quad(rdf.namedNode(subject), q.predicate, q.object, this.uGraph)
      })
      let userUri = this.sGraph + this.client.userSuffix + userId;
      
      resourceIdentified.add(rdf.quad(rdf.namedNode(subject), ns.foaf('account'), rdf.namedNode(userUri), this.uGraph));
      let resourceUri = req.protocol + '://' + req.get('host') + req.originalUrl;
      let uri = resourceUri.replace('new', `${userId}`)
      let perm = this.userPerms.createNewPermResource(userId, subject, type);
      let output = serializer.import(resourceIdentified.toStream());
      let stream = this.store.import(resourceIdentified.toStream());
      return new Promise((resolve, reject) => {
        stream.on('end', ()=>{
          perm.then(() => {
            output.on('data', jsonld => {
              log(`New resource created : ${uri}`);
              resolve({uri:uri, resource:jsonld});
            })
          })
        })
      });
    }
    return {error:'Forbidden', error_status:403, error_description:'Permission denied'}
    

  }
  
  async edit(req){
    let {headers, body} = req;
    let userId = "";
    let resource = body;

    if (headers.authorization) {
      userId = headers.authorization.replace('Bearer ', '');
    } else {
      return {error:'Bad request', error_status:400, error_description:'Incorrect ID'}
    }

    let subject = this.uGraph.value + '/' + userId;
    let accorded = await this.userPerms.hasPermission(userId, subject, type, 'Edit');
    if (accorded == true){

      console.log("accorded")
    }
  }

  //Delete an user
  async delete(headers, userInfo){

    let email = userInfo.email;
    let password = userInfo.password;
    let id = "";
    if (headers.authorization) {
      id = headers.authorization.replace('Basic ', '');
    } else {
      return {error:'Bad request', error_status:400, error_description:'Incorrect ID'}
    }

    let userId = this.sGraph.value + this.client.userSuffix + id;

    // Check if userInfo provided is correct
    const stream = this.store.match(rdf.namedNode(userId), ns.sioc('email'), rdf.literal(email), this.sGraph);
    let user = await rdf.dataset().import(stream);

    //If user is correct
    if (user && user.length != 0){
      let passStream = this.store.match(rdf.namedNode(userId), ns.account('password'), null, this.sGraph);
      let pass = "";
      let passQuads = await rdf.dataset().import(passStream);
      passQuads.forEach(quad => {
        pass = quad.object.value;
      })
      let same = bcrypt.compareSync(password, pass);

      if (same === true){
        return new Promise((resolve, reject) => {
          this.store.removeMatches(rdf.namedNode(userId), null, null, this.sGraph);
          resolve();
        })
      } else {
        return {error:"Bad request", error_status:400, error_description:"Incorrect Password"}
      }
    } else {
      return {error:"Bad request", error_status:400, error_description:"Incorrect info"}
    }
  }

  async delete(){
    return true;
  }

  async edit(){
    return true;
  }

}