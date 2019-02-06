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
        parameters: [
        {
            in: 'query',
            name: 'username',
            required: false,
            type: 'string'
        },
        {
            in: 'query',
            name: 'id',
            required: false,
            type: 'integer'
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