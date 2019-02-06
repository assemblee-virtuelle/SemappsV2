const rdf = require('rdf-ext');
const rdfStoreSparql = require('rdf-store-sparql');

module.exports = class {
    constructor(args){
        if(!args.sparqlEndpoint){
            throw new Error("No endpoint url defined");
        } 
        if (!args.uri){
            throw new Error("No uri parameter specified");
        }

        let options = {};
        if (args.updateEndpoint){
            let port = args.port ? ':' + args.port : "";
            let _updateUrl = args.uri + port + args.updateEndpoint;
            options = {updateUrl:_updateUrl};
        }
        console.log("Client created")
        this.client = new rdfStoreSparql(args.sparqlEndpoint, options);
    }
}