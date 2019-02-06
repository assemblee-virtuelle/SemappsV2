module.exports = function(userService) {
    let operations = {
      POST
    };
    
    function POST(req, res, next) {
      let ret = userService.createUser(req.query);

      if (ret.error && ret.error){
        res.status(ret.status).json(ret);
      } else {
        res.status(200).json(ret);
      }
    }
    
    // NOTE: We could also use a YAML string here.
    POST.apiDoc = {
      summary: 'Creates a Semapps User.',
      operationId: 'createUser',
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