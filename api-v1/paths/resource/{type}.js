const checkResourceAccess = require('../../Middleware/resourceSecurity');

module.exports = function(resourceService) {

    let operations = {
      GET,
      POST,
      'x-express-openapi-additional-middleware':[checkResourceAccess],
      parameters: [
        {
          in: 'path',
          name: 'type',
          required: true,
          type: 'string'
        },
      ],
    };

    async function POST(req, res, next) {
      const resource = await resourceService.create(req);
      if (resource && resource.error){
        res.status(resource.error_status).json(resource);
      } else {
        //Add permissions ?
        res.status(200).json(resource);
      }
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
              type:'array',
              items:{type:'object'}
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
  
    async function GET(req, res, next) {
  
      if(req.params){
        let ret = await resourceService.getByType(req);
        if (ret && ret.error){
          res.status(ret.error_status).json(ret);
        } else {
          res.status(200).json(ret);
        }
      }
  
    }

    GET.apiDoc = {
      summary: 'Returns a list of resources',
      operationId: 'getByType',
      tags:["resource"],
      parameters:[
        {
            in:'header',
            name:'Authorization',
            required: true,
            type:'string',
            description:'Auhorization token'
        }
      ],
      responses: {
        200: {
          description: 'Resource in jsonLD'
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