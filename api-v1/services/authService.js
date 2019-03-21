const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rdf = require('rdf-ext');
const ns = require('../utils/namespaces.js');
const saltRounds = 10;

module.exports = class {
    constructor(client){
      //TODO: get graph name from config
      this.uGraph = client.graph('User');
      this.store = client.store;
      this.sGraph = client.securityGraph();
      this.client = client;
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
        let current_date = (new Date()).valueOf().toString();
        let id = crypto.randomBytes(5).toString('hex') + current_date;
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
          rdf.quad(userSubject, ns.rdf('Type'), ns.sioc('UserAccount')),
          rdf.quad(userSubject, ns.sioc('id'), rdf.literal(id)),
          rdf.quad(userSubject, ns.foaf('accountName'), rdf.literal(username)),
          rdf.quad(userSubject, ns.sioc('email'), rdf.literal(email)),
          rdf.quad(userSubject, ns.account('password'), rdf.literal(hash)),
          rdf.quad(userSubject, ns.sioc('has_function'), bnRead),
          rdf.quad(userSubject, ns.sioc('account_of'), rdf.namedNode(this.uGraph.value + suffix)),
          rdf.quad(bnRead, ns.rdf('Type'), ns.sioc('Role')), //TODO: Ajouter role admin
          rdf.quad(bnRead, ns.access('has_permission'), ns.acl('Read')),
          rdf.quad(bnRead, ns.sioc('has_scope'), rdf.blankNode()), //TODO: Remplacer blankNode par namedNode ?
          rdf.quad(userSubject, ns.sioc('has_function'), bnWrite),
          rdf.quad(bnWrite, ns.rdf('Type'), ns.sioc('Role')),
          rdf.quad(bnWrite, ns.access('has_permission'), ns.acl('Write')),
          rdf.quad(bnWrite, ns.sioc('has_scope'), rdf.blankNode()),
        ];
        let userGraph = rdf.graph(user);
        let dataset = rdf.dataset(userGraph, this.sGraph);
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

    

}