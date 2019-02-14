module.exports = function(userService) {

  let operations = {
    GET,
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        type: 'string'
      }
    ],
  };

  function GET(req, res, next) {
    res.status(200).json(userService.userById(req.params.id));
  }
  
  // NOTE: We could also use a YAML string here.
  GET.apiDoc = {
    summary: 'Returns a Semapps User.',
    operationId: 'userById',
    tags:["user"],
    responses: {
      200: {
        description: 'User matching id'
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