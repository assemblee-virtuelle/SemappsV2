const bcrypt = require('bcrypt');
const rdf = require('rdf-ext');
const Serializer = require('@rdfjs/serializer-jsonld');
const ns = require('../utils/namespaces.js');

const serializer = new Serializer();


module.exports = class {
  constructor(sparqlStore){
    //Initialize sparql client
    this.client = sparqlStore;
    this.store = sparqlStore.store;
    this.httpClient = sparqlStore.store.client;
    
    let userInfoName = "Users";
    let userSecurityName = "UserSecurity";

    this.userSuffix = "#user_"; //Todo: put that in config

    this.userInfoGraph = rdf.namedNode(this.client.graphEndpoint + '/' + userInfoName);
    this.userSecurityGraph = rdf.namedNode(this.client.graphEndpoint + '/' + userSecurityName);

  }

  //TODO: Supprimer ?
  async userByFilter(filters){

    // let graph = filters.graph;
    // let username = filters.username;
    let users;
    if (!filters){
      const allUsersStream = this.store.match(null, null, null, this.userSecurityGraph)  
      users = await rdf.dataset().import(allUsersStream);

    } else {
      let username = filters;
      //Manage filters

      const userStream = this.store.match(null, null, rdf.literal(username), this.userSecurityGraph);
      users = await rdf.dataset().import(userStream);
    }

    return new Promise((resolve, reject) => {
      //convert to JSON LD
      let output = serializer.import(users.toStream());
      output.on('data', jsonld => {
        resolve(jsonld);
      })
    })
  }
  
  async userById(id){
    //FETCH USER INFO FROM ID

    const stream = this.store.match(null, ns.sioc('id'), rdf.literal(id), this.userSecurityGraph);

    let user = await rdf.dataset().import(stream);

    //TODO: Get user info 
    
    return new Promise((resolve, reject) => {
      let output = serializer.import(user.toStream());
      output.on('data', jsonld => {
        resolve(jsonld);
      })
    })
  }

  async createUserInfo(userInfo){

    //TODO:
    //First parse ontology in semapps front or in back with Simon's tech
    //Then compare form info with parsed ontology object for validation
    //Send the json ld if in front, if in back send the form and convert it to json ld
    //Then fill userInfo into a dataset and import it into the triple store

    let user = {
      "@context": {
        "name": "http://xmlns.com/foaf/0.1/name",
        "homepage": {
          "@id": "http://xmlns.com/foaf/0.1/workplaceHomepage",
          "@type": "@id"
        },
        "Person": "http://xmlns.com/foaf/0.1/Person"
      },
      "@id": "http://me.example.com",
      "@type": "Person",
      "name": "John Smith",
      "homepage": "http://www.example.com/"
    }

    let userInfoDataset = rdf.dataset().import(user.toStream());
  }
  
  async editUser(userInfo){
    
  }

  //Delete an user
  async deleteUser(headers, userInfo){

    let email = userInfo.email;
    let password = userInfo.password;
    let id = "";
    if (headers.authorization) {
      id = headers.authorization.replace('Basic ', '');
    } else {
      return {error:'Bad request', error_status:400, error_description:'Incorrect ID'}
    }

    let userId = this.userSecurityGraph.value + this.userSuffix + id;

    // Check if userInfo provided is correct
    const stream = this.store.match(rdf.namedNode(userId), ns.sioc('email'), rdf.literal(email), this.userSecurityGraph);
    let user = await rdf.dataset().import(stream);

    //If user is correct
    if (user && user.length != 0){
      let passStream = this.store.match(rdf.namedNode(userId), ns.account('password'), null, this.userSecurityGraph);
      let pass = "";
      let passQuads = await rdf.dataset().import(passStream);
      passQuads.forEach(quad => {
        pass = quad.object.value;
      })
      let same = bcrypt.compareSync(password, pass);

      if (same === true){
        return new Promise((resolve, reject) => {
          this.store.removeMatches(rdf.namedNode(userId), null, null, this.userSecurityGraph);
          resolve();
        })
      } else {
        return {error:"Bad request", error_status:400, error_description:"Incorrect Password"}
      }
    } else {
      return {error:"Bad request", error_status:400, error_description:"Incorrect info"}
    }
  }

}