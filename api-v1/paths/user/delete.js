module.exports = function(userService) {
    let operations = {
        POST
    };

    async function POST(req, res, next) {
        let del = await userService.deleteUser(req.headers, req.body);
        if (del && del.error){
            res.status(del.error_status).send(del.error_description);
        }
        res.sendStatus(200);
    }

    // NOTE: We could also use a YAML string here.
    POST.apiDoc = {
        summary: 'Deletes a Semapps User.',
        operationId: 'deleteUser',
        tags:["user"],
        parameters: [
            {
                in:'header',
                name:'Authorization',
                required: true,
                type:'string',
                description:'User ID, bearer token in future'
            },
            {
                in: 'body',
                name: 'toDelete',
                required: true,
                schema: {
                    type:'object',
                    properties:{
                        email: {type:'string'},
                        password: {type:'string'},
                    }
                }
            },
        ],
        responses: {
        200: {
            description: 'User successfully deleted'
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