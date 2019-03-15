module.exports = function(authService) {

    let operations = {
      POST,
    };
  
    async function POST(req, res, next) {
  
      if(req.params){
        let {email, password} = req.body;
        let ret = await authService.login(email, password);
        if (ret && ret.error){
        res.status(ret.error_status).send(ret.error_description);
        }
        res.status(200).send(ret);
      }
  
    }
    
    // NOTE: We could also use a YAML string here.
    POST.apiDoc = {
      summary: 'Login to Semapps',
      operationId: 'login',
      tags:["auth"],
      parameters:[
        {
          in:'formData',
          type:'string',
          name:'email',
          required:true,
          description:'Email address'
        },
        {
          in:'formData',
          type:'string',
          name:'password',
          required:true,
          description:'password'
        }
      ],
      responses: {
        200: {
          description: 'User ID, Token in future'
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