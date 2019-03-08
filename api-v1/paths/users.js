module.exports = function(userService) {
  let operations = {
    GET
  };
  
  async function GET(req, res, next) {
    //TODO: Change this and add userByFilter
    const users = await userService.userByFilter(req.query.filter);
    if (users.error){
      res.status(user.error_status).send(user.error_description);
    }

    res.status(200).send(users);
  }
  
  // NOTE: We could also use a YAML string here.
  GET.apiDoc = {
    summary: 'Returns a Semapps User List.',
    operationId: 'userByFilter',
    tags:["user"],
    parameters: [
      {
        in: 'query',
        name: 'filter',
        required: false,
        schema: {
          type:'object',
          additionalProperties: {
            type: "string"
          },
        }
      },
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