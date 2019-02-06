module.exports = function(userService) {
  let operations = {
    GET
  };
  
  function GET(req, res, next) {
    //TODO: Change this and add userByFilter
    res.status(200).json(userService.userByName(req.query.username));
  }
  
  // NOTE: We could also use a YAML string here.
  GET.apiDoc = {
    summary: 'Returns a Semapps User List.',
    operationId: 'userByName',
    parameters: [
      {
        in: 'query',
        name: 'username',
        required: false,
        type: 'string'
      }
    ],
    responses: {
      200: {
        description: 'User matching name'
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