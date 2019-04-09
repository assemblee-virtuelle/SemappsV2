module.exports = function(authService) {
    let operations = {
      POST
    };
    
    async function POST(req, res, next) {
      let ret = await authService.createUser(req.body);
      if (ret && ret.error){
        res.status(ret.error_status).json(ret);
      } else {
        res.status(201).json(ret);
      }
    }
    
    POST.apiDoc = {
      summary: 'Creates a Semapps User (auth).',
      operationId: 'createUser',
      'x-express-openapi-inherit-additional-middleware':false,
      tags:["auth"],
      parameters: [
        {
          in: 'formData',
          name: 'username',
          required: true,
          type:'string',
        },
        {
          in: 'formData',
          name: 'email',
          required: true,
          type:'string',
        },
        {
          in: 'formData',
          name: 'password',
          required: true,
          type:'string',
        },
      ],
      responses: {
        201: {
          description: 'New User Created'
        },
        400: {
          description: 'Invalid info'
        },
        406: {
          description: 'User already exist'
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