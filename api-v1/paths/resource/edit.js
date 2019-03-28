module.exports = function(resourceService) {
    let operations = {
      POST
    };
    
    async function POST(req, res, next) {
      const resource = await resourceService.edit(req.headers, req.body);
      if (resource && resource.error){
        res.status(resource.error_status).json(resource);
      }
      res.status(200).json(resource);
    }
    
    // NOTE: We could also use a YAML string here.
    POST.apiDoc = {
      summary: 'Edit a resource',
      operationId: 'edit',
      tags:["resource"],
      parameters: [
        {
          in: 'header',
          name: 'Authorization',
          required: true,
          type: 'string',
          description:'User ID, bearer token in future'
        },
        {
            in:'body',
            name:'resource',
            required:true,
            description:'Resource to add in jsonLD',
            schema:{
              type:'object',
              properties:{
                resourceUri: {type:'string'},
                resourceData: {type:'object'}
              }
            }
        }
      ],
      responses: {
        200: {
          description: 'Resource in jsonLD'
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