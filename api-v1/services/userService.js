const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rdf = require('rdf-ext');
const Serializer = require('@rdfjs/serializer-jsonld');
const ns = require('../utils/namespaces.js');

const serializer = new Serializer();
const saltRounds = 10;

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
  
  async createUser(userInfo){
    //TODO: mettre les infos dans un fichier de config

    //VERIFY USER INFO
    if (userInfo.username && userInfo.email && userInfo.password){
      const email = userInfo.email;
      const username = userInfo.username;
      let response = "";

      //Check if email is taken
      let stream = this.store.match(null, ns.sioc('email'), rdf.literal(email), this.userSecurityGraph);

      let matches = await rdf.dataset().import(stream);
      if (matches && matches.size != 0){
        //Send response already exist
        return {error:"Conflict", error_status:409, error_description:"Email Already Exists"};
      } else {
        let password = userInfo.password;

        //Generate random ID
        let current_date = (new Date()).valueOf().toString();
        let id = crypto.randomBytes(5).toString('hex') + current_date;
        let suffix = this.userSuffix + id;

        //Hash Password
        let salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(password, salt);

        //Convert uri in rdf-ext namedNode
        let userSubject = rdf.namedNode(this.userSecurityGraph.value + suffix);
        
        //Create basic roles blank nodes
        let bnRead = rdf.blankNode("read");
        let bnWrite = rdf.blankNode("write");

        let generalAccess; //TODO: create general access roles e.g ADMIN, MODERATOR, etc

        let user = [
          rdf.quad(userSubject, ns.rdf('Type'), ns.sioc('UserAccount')),
          rdf.quad(userSubject, ns.sioc('id'), rdf.literal(id)),
          rdf.quad(userSubject, ns.foaf('accountName'), rdf.literal(username)),
          rdf.quad(userSubject, ns.sioc('email'), rdf.literal(email)),
          rdf.quad(userSubject, ns.account('password'), rdf.literal(hash)),
          rdf.quad(userSubject, ns.sioc('has_function'), bnRead),
          rdf.quad(userSubject, ns.sioc('account_of'), rdf.namedNode(this.userInfoGraph.value + suffix)),
          rdf.quad(bnRead, ns.rdf('Type'), ns.sioc('Role')), //TODO: Ajouter role admin
          rdf.quad(bnRead, ns.access('has_permission'), ns.acl('Read')),
          rdf.quad(bnRead, ns.sioc('has_scope'), rdf.blankNode()), //TODO: Remplacer blankNode par namedNode ?
          rdf.quad(userSubject, ns.sioc('has_function'), bnWrite),
          rdf.quad(bnWrite, ns.rdf('Type'), ns.sioc('Role')),
          rdf.quad(bnWrite, ns.access('has_permission'), ns.acl('Write')),
          rdf.quad(bnWrite, ns.sioc('has_scope'), rdf.blankNode()),
        ];
        let userGraph = rdf.graph(user);
        let dataset = rdf.dataset(userGraph, this.userSecurityGraph);
        const stream = this.store.import(dataset.toStream());
        return new Promise((resolve, reject) => {
          rdf.waitFor(stream).then((e) => {
            response = {
              user: userSubject.value,
              id:id
            }
            resolve(response);
          })
        })
      }
    } else {
      return {error:"Bad request", error_status:400, error_description:"Incorrect info"}
    }
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
  async deleteUser(userInfo){

    let email = userInfo.email;
    let password = userInfo.password;
    let id = userInfo.id;

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