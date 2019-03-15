module.exports = function(resourceService) {
    let operations = {
      POST
    };
    
    async function POST(req, res, next) {
      const resource = await resourceService.create(req.headers, req.query);
      if (resource.error){
        res.status(user.error_status).send(user.error_description);
      }
      res.status(200).send(resource);
    }
    
    // NOTE: We could also use a YAML string here.
    POST.apiDoc = {
      summary: 'Create a new resource',
      operationId: 'create',
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
                resourceType: {type:'string'},
                resourceData: {type:'object'}
              }
            }
        }
      ],
      responses: {
        200: {
          description: 'User matching name'
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