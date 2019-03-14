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

  async function GET(req, res, next) {

    if(req.params && req.params.id !== "new" && req.params.id !== "edit" && req.params.id !== "delete"){
      let ret = await userService.userById(req.params.id);
  
      if (ret && ret.error){
        res.status(ret.error_status).send(ret.error_description);
      }
      res.status(200).send(ret);
    }

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