const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rdf = require('rdf-ext');
const Serializer = require('@rdfjs/serializer-jsonld');
const ns = require('../utils/namespaces.js');

const saltRounds = 10;

//TODO: do roles
// const rolesGraphName = "Roles";
// const rolesGraph = rdf.namedNode(this.client.graphEndpoint + '/' + rolesGraphName);
// let adminRole = rdf.graph( [
//   rdf.quad(rolesGraph),
// ]);
// console.log('rolesGrpah :', rolesGrpah);


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
    
    let userInfoName = "Users";
    let userSecurityName = "UserSecurity";

    this.userSuffix = "#user_";

    this.userInfoGraph = rdf.namedNode(this.client.graphEndpoint + '/' + userInfoName);
    this.userSecurityGraph = rdf.namedNode(this.client.graphEndpoint + '/' + userSecurityName);
    
    console.log('userGraph :', this.userInfoGraph.value)
    console.log('userSecurity :', this.userSecurityGraph.value)
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
    //TODO: mettre les infos dans un fichier de config


    //IMPORTANT NOTE: semapps design transition on webc load

    //VERIFY USER INFO
    if (userInfo.username && userInfo.email && userInfo.password){
      const email = userInfo.email;
      const username = userInfo.username;
      let canCreate = true; //TODO: Check if email already exist
      let response = "";

      //Check if email is taken
      let stream = this.store.match(null, ns.sioc('email'), rdf.literal(email), rdf.namedNode(this.userSecurityGraph));

      let matches = await rdf.dataset().import(stream);
      if (matches.length != 0){
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
          rdf.quad(bnRead, ns.sioc('has_scope'), rdf.blankNode()),
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
      return {error:"Bad request", error_type:400, error_description:"Incorrect info"}
    }

    //CREATE USER CODE
  }
  
  editUser(userInfo){
    console.log("Edit User", userInfo);
    //EDIT USER CODE
  }
  
  deleteUser(userInfo){
    //471c430a3f1550756600333
    //9b3de265fb1550756770593

    let email = userInfo.email;
    let id = userInfo.id;
    id = "9b3de265fb1550756770593";
    let password = userInfo.password;

    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(password, salt);



    let query = `
    SELECT ?person ?pass WHERE {
      GRAPH <${this.userSecurityGraph}> {
        ?person <${ns.sioc('email').value}> "${rdf.literal(email)}".
        ?person <${ns.sioc('id').value}> "${rdf.literal(id)}".
        ?person <http://purl.org/NET/acc#password> ?pass.
      }
    }
    `;
    console.log('query :', query);
    //Check if userInfo provided is correct
    const test = this.store.construct(query, this.userSecurityGraph);
    let stream = this.store.import(test);

    // this.store.match(rdf.namedNode(this.userSecurityGraph.value + this.userSuffix + id), ns.sioc('email'), rdf.literal())
    
    //Check if user has permissions
    return new Promise((resolve, reject) => {
      rdf.waitFor(stream).then((e) => {
        resolve(e);
      })
    })
    //DELETE USER CODE
  }

}