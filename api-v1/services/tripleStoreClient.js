const Readable = require('readable-stream');
const rdf = require('rdf-ext');
const fetch = require('node-fetch');
const SparqlStore = require('rdf-store-sparql');

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

        if (args.updateEndpoint){
            let _updateUrl = uriStart + args.updateEndpoint;
            this.updateEndpoint = _updateUrl;
            options = { updateUrl:_updateUrl };
        }
        this.uri = uriStart;
        let sparqlUrl = uriStart + args.sparqlEndpoint;
        this.sparqlEndpoint = sparqlUrl;
        this.graphEndpoint = uriStart + args.graphEndpoint;

        this.store = new SparqlStore(sparqlUrl, options);

        fetch(uri + '/$/ping').then(res => {
            console.log('res.status :', res.status)
            if(res.status == 401){
                console.log("Authentification needed");
                //Send auth
            }
            console.log("Triple store found and set")
        }).catch(err => console.log('err :', err))
    }

    quadToStream(graph){
        let readable = new Readable();
        readable._readableState.objectMode = true
        readable._read = () => {
          graph._quads.forEach((quad) => {
            readable.push(quad)
          })
          readable.push(null)
        }
        return readable;
    }

}