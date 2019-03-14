module.exports = class {
    constructor(sparqlStore){
        //Initialize sparql client
        this.client = sparqlStore;
        this.store = sparqlStore.store;
        this.httpClient = sparqlStore.store.client;
        
        let userInfoName = "Users";
        let userSecurityName = "UserSecurity";

        this.userSuffix = "#user_"; //Todo: put that in config
    }
    
}