module.exports = function(resourceService) {

    let operations = {
      GET,
    //   DELETE,
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

    // async function DELETE(req, res, next){
    //     if (req.prams){
    //         let ret = await resourceService.delete(req.header, req.params);
    //         if (ret && ret.error){
    //             res.status(ret.error_status).json(ret);
    //         }
    //         res.status(200).json(ret);
    //     }
    // }

    // DELETE.apiDoc = {
    //     summary: 'Deletes a ressource',
    //     operationId: 'delete',
    //     tags: ["resource"],
    //     parameters: [
    //         {
    //             in:'header',
    //             required: true,
    //             type:'string',
    //             name:'Authorization',
    //             description:'Bearer {token}'
    //         }
    //     ]
    // }
  
    async function GET(req, res, next) {
  
      if(req.params){
        let ret = await resourceService.getById(req.headers, req.params);
        if (ret && ret.error){
          res.status(ret.error_status).json(ret);
        } else {
          res.status(200).json(ret);
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