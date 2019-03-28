module.exports = function(userService) {
    let operations = {
      POST
    };
    
    async function POST(req, res, next) {
      const user = await userService.create(req);
      if (user && user.error){
        res.status(user.error_status).json(user);
      } else {
        res.status(200).json(user);
      }
    }
    
    // NOTE: We could also use a YAML string here.
    POST.apiDoc = {
      summary: 'Create a new user Info',
      operationId: 'create',
      tags:["user"],
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
            description:'UserInfo to add in jsonLD',
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
    
    return operations;
  }