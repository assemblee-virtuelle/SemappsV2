const rdf = require('rdf-ext');
const fetch = require('node-fetch');
const SparqlStore = require('rdf-store-sparql');
const formats = require('@rdfjs/formats-common');
const fetchLite = require('@rdfjs/fetch-lite');

/**
 * Creates the link into Jena triple store
 */
module.exports = class {
    constructor(args){

        if(!args.sparqlEndpoint){
            throw new Error("No endpoint url defined");
        } 
        if (!args.uri){
            throw new Error("No uri parameter specified");
        }

        let options = {};
        let port = args.port ? ':' + args.port : "";
        let uri = args.uri + port;
        let uriStart = uri + '/' + args.dataset;

        this.roles = args.roles;

        if (args.updateEndpoint){
            let _updateUrl = uriStart + args.updateEndpoint;
            this.updateEndpoint = _updateUrl;
            options = { updateUrl:_updateUrl };
        }

        this.uri = uriStart;
        let sparqlUrl = uriStart + args.sparqlEndpoint;
        this.sparqlEndpoint = sparqlUrl;
        this.graphEndpoint = uriStart + args.graphEndpoint;

        //TODO: Put this in config
        this.userSecurity = "UserSecurity";
        this.userPermission = "UserPermission";
        this.userSuffix = "/user_";

        this.store = new SparqlStore(sparqlUrl, options);
        this.store.client.fetch = (url, options) => fetchLite(url, { formats, ...options });

        /**
         * Test connection into jena
         * TODO: check connexion and if 403, reauthenticate
         */
        fetch(uri + '/$/server').then(res => {
            //TODO: check WWW authenticate
            if(res.status == 401){
                console.log("Authentification needed");
                //Send auth
            }

        })
        .catch(err => {
            throw new Error('Jena offline')
        })
        .catch(err => console.log(err))
    }

    /**
     * @description Returns the graph URI
     * @returns {string} uri
     * @param {*} graph 
     */
    graph(graph){
        return rdf.namedNode(this.graphEndpoint + '/' + graph);
    }

    /**
     * @description Returns the security graph URI
     * @returns {string} uri
     */
    securityGraph(){
        return rdf.namedNode(this.graphEndpoint + '/' + this.userSecurity);
    }

    /**
     * @description Returns the permissions graph URI
     * @returns {string} uri
     */
    permissionGraph(){
        return rdf.namedNode(this.graphEndpoint + '/' + this.userPermission);
    }

}