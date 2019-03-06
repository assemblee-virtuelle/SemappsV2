module.exports = function(userService) {
    let operations = {
      POST
    };
    
    async function POST(req, res, next) {
      let ret = await userService.createUser(req.query);

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
            in: 'query',
            name: 'username',
            required: true,
            type: 'string'
        },
        {
            in: 'query',
            name: 'email',
            required: true,
            type: 'string'
        },
        {
            in: 'query',
            name: 'password',
            required: true,
            type: 'string'
        },
      ],
      responses: {
        200: {
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