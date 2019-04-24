module.exports = function(sparqlService){

    let operations = {
        POST
    }

    async function POST(req, res, next) {
        const ret = await sparqlService.update(req);
        if (ret && ret.error){
          res.status(ret.error_status).json(ret);
        } else {
          res.status(200).json(ret);
        }
      }
    
    // NOTE: We could also use a YAML string here.
    POST.apiDoc = {
        summary: 'Sparql update query',
        operationId: 'update',
        tags:["sparql"],
        parameters: [
            {
                in: 'header',
                name: 'Authorization',
                required: true,
                type: 'string',
                description:'User ID, bearer token in future'
            },
            {
                in:'query',
                name:'query',
                required:true,
                description:'Sparql update query string',
                type:'string'
            }
        ],
        responses: {
            200: {
            description: 'Response in jsonld'
            },
            400:{
            description: 'Invalid info'
            },
            default: {
            description: 'An error occurred',
            schema: {
                additionalProperties: true
            }
            }
        }
    };

    return operations;
}
