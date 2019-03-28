const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Security = require('./securityService');
const rdf = require('rdf-ext');
const ns = require('../utils/namespaces.js');
const saltRounds = 10;

module.exports = class {
    constructor(client){
      //TODO: get graph name from config
      this.uGraph = client.graph('User');
      this.store = client.store;
      this.pGraph = client.permissionGraph();
      this.sGraph = client.securityGraph();
      this.client = client;
      this.permissionsAtCreate = ['Create', 'Write', 'Read', 'Delete']; //TODO: Change this for object key value in config
      this.typeList = ['Project', 'Document', 'Event', 'Good', 'Service', 'Person', 'Organization', 'Places', 'User'];
      this.userPerms = new Security(this.client);

    }

    async login(email, password){
      if (email && password){
        let matchStream = this.store.match(null, ns.sioc('email'), rdf.literal(email), this.sGraph);
        let match = await rdf.dataset().import(matchStream);

        if (match && match.size != 0){
            let id = match.toArray()[0].subject.value;
            let userStream = this.store.match(rdf.namedNode(id), null, null, this.sGraph);
            let user = await rdf.dataset().import(userStream);
            let pass = "";
            
            let passMatch = user.match(rdf.namedNode(id), ns.account('password'), null);
            pass = passMatch.toArray()[0] ? passMatch.toArray()[0].object.value : null;
            
            let test = bcrypt.compareSync(password, pass);
            if (test === true){
              let userId = user.match(rdf.namedNode(id), ns.sioc('id'), null);
              return Promise.resolve(userId.toArray()[0] ? userId.toArray()[0].object.value : null);
            } else {
              return {error:'Bad request', error_status:400, error_description:'Incorrect Password'}
            }
        } else {
          return {error:'Bad request', error_status:400, error_description:'No user'}
        }
      } else {
        return {error:'Bad request', error_status:400, error_description:'No info provided'}
      }
    }

      
  async createUser(userInfo){

    //VERIFY USER INFO
    if (userInfo.username && userInfo.email && userInfo.password){
      const email = userInfo.email;
      const username = userInfo.username;
      let response = "";

      //Check if email is taken
      
      let stream = this.store.match(null, ns.sioc('email'), rdf.literal(email), this.sGraph);

      let matches = await rdf.dataset().import(stream);
      if (matches && matches.size != 0){
        //Send response already exist
        return {error:"Conflict", error_status:409, error_description:"Email Already Exists"};
      } else {
        let password = userInfo.password;

        //Generate random ID
        let current_date = Date.now();
        let id = crypto.randomBytes(3).toString('hex') + current_date;
        let suffix = this.client.userSuffix + id;

        //Hash Password
        let salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(password, salt);

        //Convert uri in rdf-ext namedNode
        let userSubject = rdf.namedNode(this.sGraph.value + suffix);
        
        //Create basic roles blank nodes
        let bnRead = rdf.blankNode("read");
        let bnWrite = rdf.blankNode("write");

        let generalAccess; //TODO: create general access roles e.g ADMIN, MODERATOR, etc

        let user = [
          rdf.quad(userSubject, ns.rdf('Type'), ns.sioc('UserAccount'), this.sGraph),
          rdf.quad(userSubject, ns.sioc('id'), rdf.literal(id), this.sGraph),
          rdf.quad(userSubject, ns.foaf('accountName'), rdf.literal(username), this.sGraph),
          rdf.quad(userSubject, ns.sioc('email'), rdf.literal(email), this.sGraph),
          rdf.quad(userSubject, ns.account('password'), rdf.literal(hash), this.sGraph),
          rdf.quad(userSubject, ns.sioc('account_of'), rdf.namedNode(this.uGraph.value), this.sGraph)
        ];

        //Add default permissions (read, write, create and delete on all graph for the moment)
        let permQuad = this.userPerms.createDefaultPermissions(userSubject, id, this.typeList, this.permissionsAtCreate)
        let permDataset = rdf.dataset(permQuad)

        let userGraph = rdf.graph(user);
        let dataset = rdf.dataset(userGraph, this.sGraph);
        let ret = dataset.merge(permDataset);
        const stream = this.store.import(ret.toStream());
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

    

}