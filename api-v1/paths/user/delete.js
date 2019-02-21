module.exports = function(userService) {
    let operations = {
        POST
    };

    function POST(req, res, next) {
        res.status(200).json(userService.deleteUser(req.query));
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
        {
            in: 'query',
            name: 'id',
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