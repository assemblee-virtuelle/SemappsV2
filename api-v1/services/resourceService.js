module.exports = class {
    constructor(store){
        // //Initialize sparql client
        this.store = store.store;    
        this.sGraph = store.securityGraph();
    }

    async getUserFromId(id){ //TODO: transform in getUserFromToken(token)

    }

    async create(headers, resourceInfo){
        let id = "";
        if (headers.authorization) {
          id = headers.authorization.replace('Basic ', '');
        } else {
            return {error:'Bad request', error_status:400, error_description:'Incorrect ID'}
        }

        console.log('params :', params)
        return new Promise((res, rej) => {
            resolve();
        })
    }
    
}