module.exports = function(userService) {
    let operations = {
        POST
    };

    async function POST(req, res, next) {
        console.log("Delete user")
        let del = await userService.deleteUser(req.body);
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
            in: 'query',
            name: 'email',
            required: true,
            type: 'string'
        },
        {
            in: 'query',
            name: 'password',
            required: true,
            type: 'string'
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