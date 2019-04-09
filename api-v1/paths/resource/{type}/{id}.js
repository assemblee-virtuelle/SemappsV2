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
        },
        {
            in:'path',
            name: 'type',
            required: true,
            type: 'string'
        }
      ],
    };

    async function DELETE(req, res, next){
      const resource = await resourceService.delete(req);
      if (resource && resource.error){
        res.status(resource.error_status).json(resource);
      } else {
        res.status(200).json(resource);
      }
    }


    async function PUT(req, res, next) {
      const resource = await resourceService.edit(req);
      if (resource && resource.error){
        res.status(resource.error_status).json(resource);
      } else {
        res.status(200).json(resource);
      }
    }
  
    async function GET(req, res, next) {
  
      if(req.params){
        let ret = await resourceService.getById(req.params);
        if (ret && ret.error){
          res.status(ret.error_status).json(ret);
        } else {
          res.status(200).json(ret);
        }
      }
    }

    PUT.apiDoc = {
      summary: 'Edit a resource',
      operationId: 'edit',
      tags:["resource"],
      parameters: [
        {
          in: 'header',
          name: 'Authorization',
          required: true,
          type: 'string',
          description:'User ID, bearer token in future'
        },
        {
            in:'body',
            name:'resource',
            required:true,
            description:'Resource data in jsonLD',
            schema:{
              type:'array',
              items:{type:'object'}
            }
        }
      ],
      responses: {
        200: {
          description: 'Resource in jsonLD'
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


    DELETE.apiDoc = {
      summary: 'Deletes a ressource',
      operationId: 'delete',
      tags: ["resource"],
      parameters: [
          {
              in:'header',
              required: true,
              type:'string',
              name:'Authorization',
              description:'Bearer {token}'
          }
      ],
      responses: {
        200: {
          description: 'Resource in jsonLD'
        },
        default: {
          description: 'An error occurred',
          schema: {
            additionalProperties: true
          }
        }
      }
  }
    
    GET.apiDoc = {
      summary: 'Returns a resource',
      operationId: 'getById',
      tags:["resource"],
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
          description: 'Resource in jsonLD'
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