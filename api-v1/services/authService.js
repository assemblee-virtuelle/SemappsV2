const bcrypt = require('bcrypt');
const rdf = require('rdf-ext');
const ns = require('../utils/namespaces.js');

module.exports = class {
    constructor(sparqlStore){

        this.client = sparqlStore;
        this.store = sparqlStore.store;
        this.httpClient = sparqlStore.store.client;
        
        // let userInfoName = "Users";
        let userSecurityName = "UserSecurity";
    
        this.userSuffix = "#user_"; //Todo: put that in config
        this.userSecurityGraph = rdf.namedNode(this.client.graphEndpoint + '/' + userSecurityName);

    }

    async login(email, password){
        if (email && password){
            let matchStream = this.store.match(null, ns.sioc('email'), rdf.literal(email), this.userSecurityGraph);

            let user = await rdf.namedNode().import(matchStream);

            if (user && user.size != 0){
                let findPw = user.match(null, ns.account('password'), null, this.userSecurityGraph);
                let pass = "";
                findPw.forEach(quad => {
                    pass = quad.object.value;
                })

                let test = bcrypt.compareSync(password, pass);
                if (test === true){
                    return new Promise((resolve, reject) => {
                        resolve();
                    })
                }
            }
        }
    }

    

}