const Security = require('./securityService');

module.exports = class {
    constructor(store){
        // //Initialize sparql client
        this.store = store.store;    
        this.sGraph = store.securityGraph();
        this.client = store;
    }

    async getUserFromId(id){ //TODO: transform in getUserFromToken(token)

    }

    async create(headers, resourceInfo){
        let id = "";
        console.log('resourceInfo :', resourceInfo)
        if (headers.authorization) {
          id = headers.authorization.replace('Basic ', '');
        } else {
            return {error:'Bad request', error_status:400, error_description:'Incorrect ID'}
        }
        //Verify user ID
        let userPerms = new Security(this.client);
        userPerms.canCreate(id, () => {
            
            console.log('params :', params)
            return new Promise((res, rej) => {
                resolve();
            })
        });

    }
    
}