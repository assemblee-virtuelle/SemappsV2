module.exports = function(resourceService) {

  let operations = {
    GET,
    PUT,
    DELETE,
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        type: 'string'
      }
    ],
  };

  async function DELETE(req, res, next){
    let ret = await resourceService.delete(req);
    if (ret && ret.error){
      res.status(ret.error_status).send(ret.error_description);
    } else {
      res.status(200).send(ret);
    }
  }

  async function PUT(req, res, next){
    let ret = await resourceService.edit(req);
    if (ret && ret.error){
      res.status(ret.error_status).send(ret.error_description);
    } else {
      res.status(200).send(ret);
    }
  }

  async function GET(req, res, next) {
    let ret = await resourceService.getById(req.params.id);
    if (ret && ret.error){
      res.status(ret.error_status).send(ret.error_description);
    } else {
      res.status(200).send(ret);
    }
  }

  DELETE.apiDoc = {
    summary: 'Delete a Semapps User',
    operationId: 'delete',
    tags:["user"],
    parameters:[
      {
        in:'header',
        name:'Authorization',
        required: true,
        type:'string',
        description:'Auhorization token'
    }
    ],
    responses: {
      200: {
        description: 'User deleted'
      },
      default: {
        description: 'An error occurred',
        schema: {
          additionalProperties: true
        }
      }
    }
  }

  PUT.apiDoc = {
    summary: 'Edit a Semapps User',
    operationId: 'edit',
    tags:["user"],
    parameters:[
      {
        in:'header',
        name:'Authorization',
        required: true,
        type:'string',
        description:'Auhorization token'
    }
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
  }
  
  // NOTE: We could also use a YAML string here.
  GET.apiDoc = {
    summary: 'Returns a Semapps User.',
    operationId: 'userById',
    tags:["user"],
    parameters:[
      {
        in:'header',
        name:'Authorization',
        required: true,
        type:'string',
        description:'Auhorization token'
    }
    ],
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