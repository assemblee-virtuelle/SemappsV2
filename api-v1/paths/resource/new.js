module.exports = function(resourceService) {
    let operations = {
      POST
    };
    
    async function POST(req, res, next) {
      //TODO: Change this and add userByFilter
      const resource = await resourceService.create(req.query);
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
        // {
        //   in: 'header',
        //   name: 'token',
        //   required: true,
        //   type: 'string',
        //   description:'Authrization: Bearer token'
        // },
        {
          in: 'query',
          name: 'type',
          required: true,
          type: 'string',
          description:'The type of resource',
        },
        {
            in:'body',
            name:'resource',
            required:true,
            schema:{
              type:'object',
              additionalProperties:{
                type:'string'
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