module.exports = function(userService) {
    let operations = {
      POST
    };
    
    async function POST(req, res, next) {
      let ret = await userService.createUser(req.query);

      if (ret.error){
        res.sendStatus(500);
      } else {
        res.sendStatus(201);
      }
    }
    
    // NOTE: We could also use a YAML string here.
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