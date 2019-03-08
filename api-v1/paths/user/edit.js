module.exports = function(userService) {
    let operations = {
      POST
    };
    
    function POST(req, res, next) {
      res.status(200).json(userService.editUser(req.body));
    }
    
    // NOTE: We could also use a YAML string here.
    POST.apiDoc = {
      summary: 'Edit a Semapps User.',
      operationId: 'editUser',
      tags:["user"],
      consumes: ['application/json'],
      parameters: [
        {
            in: 'body',
            name: 'user',
            required: true,
            schema: {
              type:'object',
              properties: {
                id: {
                  type: 'string',
                }
              },
              required: ['id'],
              additionalProperties: {
                type: "string"
              }
            }
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