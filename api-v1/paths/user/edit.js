module.exports = function(userService) {
    let operations = {
      POST
    };
    
    function POST(req, res, next) {
      res.status(200).json(userService.editUser(req.query));
    }
    
    // NOTE: We could also use a YAML string here.
    POST.apiDoc = {
      summary: 'Edit a Semapps User.',
      operationId: 'editUser',
      tags:["user"],
      parameters: [
        {
            in: 'query',
            name: 'username',
            required: false,
            type: 'string'
        },
        {
            in: 'query',
            name: 'email',
            required: false,
            type: 'string'
        },
        {
            in: 'query',
            name: 'password',
            required: false,
            type: 'string'
        },
        {
            in: 'query',
            name: 'id',
            required: true,
            type: 'string'
        },
      ],
      responses: {
        200: {
          description: 'User successfully edited'
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