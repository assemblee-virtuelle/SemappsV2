module.exports = function(userService) {
  let operations = {
    GET
  };
  
  async function GET(req, res, next) {
    //TODO: Change this and add userByFilter
    const users = await userService.userByFilter(req.query.filter);

    console.log('users :', users)

    res.status(200).send(users);
  }
  
  // NOTE: We could also use a YAML string here.
  GET.apiDoc = {
    summary: 'Returns a Semapps User List.',
    operationId: 'userByFilter',
    parameters: [
      {
        in: 'query',
        name: 'filter',
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