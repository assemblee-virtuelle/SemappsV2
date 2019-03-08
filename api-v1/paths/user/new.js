module.exports = function(userService) {
    let operations = {
      POST
    };
    
    async function POST(req, res, next) {      
      let ret = await userService.createUser(req.body);

      if (ret && ret.error){
        res.status(ret.error_status).send(ret.error_description);
      } else {
        res.status(201).json(ret);
      }
    }
    
    POST.apiDoc = {
      summary: 'Creates a Semapps User.',
      operationId: 'createUser',
      tags:["user"],
      parameters: [
        {
            in: 'body',
            name: 'user',
            required: true,
            schema: {
              type: 'object',
              properties: {
                username: {type:'string'},
                email: {type:'string'},
                password: {type:'string'}
              }
            }
        }
      ],
      responses: {
        201: {
          description: 'New User Created'
        },
        400: {
          description: 'Invalid info'
        },
        406: {
          description: 'User already exist'
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