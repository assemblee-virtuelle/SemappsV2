module.exports = class {
    constructor(client){
        this.store = client.store;    
        this.sGraph = client.securityGraph();
        this.client = client;
    }

    async userExist(id){
        
    }

    canCreate(id, callback){
        fetch(this.sGraph + this.client.userSuffix + id, {
            method:'GET',
            headers:{
                'Authorization': `Basic ${id}`
            }
        })
    }
}