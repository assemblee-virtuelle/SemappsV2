const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rdf = require('rdf-ext');
const Serializer = require('@rdfjs/serializer-jsonld');
const ns = require('../utils/namespaces.js');

const saltRounds = 10;

let users = {
  34234123: {
    name: 'Toto',
    email: 'toto@toto.fr',
    password: '123',
  },
  54643543:{
    name: 'Bob',
    email: 'test@test.fr',
    password: 'test',
  }
};

module.exports = class {
  constructor(sparqlStore){
    //Initialize sparql client
    this.client = sparqlStore;
    this.store = sparqlStore.store;
  }

  async userByFilter(filters){
    const serializer = new Serializer();
    let graph = rdf.namedNode('http://localhost:3030/SemappsTests/data/Users');
    let test = rdf.literal('SamdsysdsdV');

    //Apply filters to match
    const stream = this.client.match(null, null, test, graph);
    
    let users = rdf.dataset();

    return new Promise((resolve, reject) => {
      users.import(stream).then(dataset => {
        let output = serializer.import(dataset.toStream());
        output.on('data', jsonld => {
          console.log('jsonld :')
          resolve(jsonld);
        })
      });
    })
  }
  
  userById(id){
    //FETCH USER INFO FROM ID
    return users[id] ? users[id] : "";
  }
  
  async createUser(userInfo){
    const userGraphName = "User";
    const userSecurityName = "UserSecurity";
    const userInfoGraph = rdf.namedNode(this.client.graphEndpoint + '/' + userGraphName);
    const userSecurityGraph = rdf.namedNode(this.client.graphEndpoint + '/' + userSecurityName);
    
    console.log('userGraph :', userInfoGraph)
    console.log('userSecurity :', userSecurityGraph)

    //VERIFY USER INFO
    if (userInfo.username && userInfo.email && userInfo.password){
      const email = userInfo.email;
      const username = userInfo.username;
      let exists = false; //TODO: Check if email already exist
      let response = "";

      //User found
      if (!exists){
        let password = userInfo.password;
        let current_date = (new Date()).valueOf().toString();
        let id = crypto.randomBytes(5).toString('hex') + current_date;

        console.log('id :', id);
        let salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(password, salt);

        //Create semantic user
        let userSubject = rdf.namedNode(userSecurityGraph.value + "#user_" + id);
        
        let specificAccess = rdf.blankNode();
        let generalAccess; //TODO: create general access roles e.g ADMIN, MODERATOR, etc
        

        let user = [
          rdf.quad(userSubject, ns.rdf('Type'), ns.sioc('UserAccount')),
          rdf.quad(userSubject, ns.sioc('id'), rdf.literal(id)),
          rdf.quad(userSubject, ns.foaf('accountName'), rdf.literal(username)),
          rdf.quad(userSubject, ns.sioc('email'), rdf.literal(email)),
          rdf.quad(userSubject, ns.account('password'), rdf.literal(hash)),
          rdf.quad(userSubject, ns.sioc('has_function'), specificAccess),
          rdf.quad(specificAccess, ns.rdf('Type'), ns.sioc('Role')),
          rdf.quad(specificAccess, ns.access('has_permission'), rdf.namedNode("http://example.org/data/admin"))
        ];
        let userGraph = rdf.graph(user);
        let dataset = rdf.dataset(userGraph, userSecurityGraph);
        const stream = this.store.import(dataset.toStream());
        return new Promise((resolve, reject) => {
          rdf.waitFor(stream).then((e) => {
            resolve(response);
          })
        })
        
      } else {
        //Email already in use
        console.log("Email already exist");
        return {error:"email", status:409, description:"Email already exist"};
      }
    }

    //CREATE USER CODE
  }
  
  editUser(userInfo){
    console.log("Edit User", userInfo);
    //EDIT USER CODE
  }
  
  deleteUser(userInfo){
    console.log("Delete user", userInfo);
    //DELETE USER CODE
  }

}