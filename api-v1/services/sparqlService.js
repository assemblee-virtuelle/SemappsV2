const rdf = require('rdf-ext');
const N3Parser = require('rdf-parser-n3')

let formats = {
  parsers: new rdf.Parsers({
    'text/turtle': N3Parser
  })
}

module.exports = class {
    constructor(client){
        this.store = client.store;    
        this.client = client;
    }

    /**
     * Makes a direct endpoint into /update from Jena 
     * @param {*} req 
     */
    async update(req){
        let sparqlQuery = req.query.query;

        if (sparqlQuery){
            let result = this.store.update(sparqlQuery);
            return new Promise((resolve, reject) => {
                rdf.waitFor(result).then(() => {
                    resolve();
                })
                .catch(err => reject(err))
            })
        }
    }

    /**
     * Direct endpoint into /select from Jena
     * @param {} req 
     */
    async select(req){
        let sparqlQuery = req.query.query;

        if(sparqlQuery){
            return new Promise((resolve, reject) => {
                this.store.client.selectQuery(sparqlQuery).then(res => {
                    var stream = res.body
                    var content = ''
                    stream.on('data', function (result) {
                        content += result.toString()
                    })
                    stream.on('end', function () {
                        // parse and stringify the content for pretty print
                        if (res.status >= 400){
                            return({error_status:res.status, error_description:content, error:res.statusText})
                        } else {
                            resolve(content)
                        }
                    })
                    stream.on('error', function (err) {
                        return({error_status:res.status, error_description:err, error:res.statusText});
                    })
                })
                .catch(err => console.log(err))
            })
        }
    }
}