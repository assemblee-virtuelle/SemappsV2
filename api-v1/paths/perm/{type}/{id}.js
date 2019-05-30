const permSecurity = require('../../../Middleware/permissionSecurity');

/**
 * CRUD for permissions on a specific resource
 */
module.exports = function(securityService) {

    let operations = {
        GET,
        PUT,
        DELETE,
        POST,
        'x-express-openapi-additional-middleware':[permSecurity],
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

    async function POST(req, res, next){
        const perms = await securityService.create(req);
        if (perms && perms.error){
            res.status(perms.error_status).json(perms);
        } else {
            res.status(200).json(perms);
        }
    }

    async function DELETE(req, res, next){
        const perms = await securityService.delete(req);
        if (perms && perms.error){
            res.status(perms.error_status).json(perms);
        } else {
            res.status(200).json(perms);
        }
    }


    async function PUT(req, res, next) {
        const perms = await securityService.edit(req);
        if (perms && perms.error){
            res.status(perms.error_status).json(perms);
        } else {
            res.status(200).json(perms);
        }
    }

    async function GET(req, res, next) {
        let ret = await securityService.get(req);
        if (ret && ret.error){
            res.status(ret.error_status).json(ret);
        } else {
            res.status(200).json(ret);
        }
    }

    //TODO: Make an external schema of permissions (open api spec)
    POST.apiDoc = {
        summary: 'Create new set of permissions',
        operationId: 'create',
        tags:["perms"],
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
                name:'perms',
                required:true,
                description:'Permissions set',
                schema:{
                type:'array',
                items:{
                    type:'object',
                    properties:{
                        uri: {type:'string'},
                        permissions: {type:'array', items:{type:'string'}}
                    }
                    }
                }
            }
        ],
        responses: {
            200: {
                description: 'Created'
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

    PUT.apiDoc = {
      summary: 'Edit permissions',
      operationId: 'edit',
      tags:["perms"],
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
            name:'perms',
            required:true,
            description:'Resource data in jsonLD',
            schema:{
              type:'array',
              items:{
                type:'object',
                properties:{
                    uri: {type:'string'},
                    permissions: {type:'array', items:{type:'string'}}
                }
              }
            }
        }
      ],
      responses: {
        200: {
          description: 'Successfully edited'
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
      tags: ["perms"],
      parameters: [
          {
              in:'header',
              required: true,
              type:'string',
              name:'Authorization',
              description:'Bearer {token}'
          },
          {
            in:'body',
            name:'uris',
            required:true,
            description:'Remove permissions for sent uris',
            schema:{
              type:'array',
              items:{type:'string'}
            }
        }
      ],
      responses: {
        200: {
          description: 'Deleted'
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
      summary: 'Returns a set of permissions for selected resource',
      operationId: 'getPerms',
      tags:["perms"],
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
          description: 'Permissions',
          schema:{
            type:'array',
            items:{
              type:'object',
              properties:{
                  uri: {type:'string'},
                  permissions: {type:'array', items:{type:'string'}}
              }
            }
          }
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