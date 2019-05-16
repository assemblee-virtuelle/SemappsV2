const rdf = require('rdf-ext');
const ns = require('../utils/namespaces')
const log = require('debug')('semapps:security');

let store = null;
let client = null;

module.exports = async function checkResourceAccess(req, res, next){
    let permissions = null;
    let allowed = false;
    client = req.client;
    store = req.store;

    if(req.userId){
        let type = req.params.type;
        let resourceUri;

        //Get the list of all permissions of all users for that resource
        permissions = await _getResourcePermissions(req.params.id, type);
        if (permissions.length == 0){
            res.sendStatus(403);
            return;
        }

        //With GRAPH TYPE Api implementation, no need to check for req.param.id
        if (req.params.id){
            //If resource is private and the user has no rights on it return unauthorized
            resourceUri = client.graph(type).value + '/' + req.params.id;

            if (await _isResourcePublic(resourceUri, client.graph(type))){
                allowed = true;
            }
            else if (await _isResourcePrivateForUser(resourceUri, req.userId, client.graph(type))){
                allowed = await _checkUserPermissions(req, permissions, resourceUri)
            } else{
                //If resource is not private nor public, check for user permissions
                allowed = await _checkUserPermissions(req, permissions, resourceUri);
                //If user is not allowed, check for Graph wide permissions eg: user permissions of http://localhost:3030/TestSemapps/data/Document/
                if (!allowed){
                    resourceUri = client.graph(type).value;
                    permissions = await _getResourcePermissions(null, type);
                    if (permissions.length == 0){
                        res.sendStatus(403);
                        return;
                    }
                    allowed = await _checkUserPermissions(req, permissions, resourceUri);
                }
            }
        } else {
            resourceUri = client.graph(type).value;
            allowed = await _checkUserPermissions(req, permissions, resourceUri);
        }
        //TODO: check if API is permission, if in permission API, only check for CONTROL rights

        if (!allowed){
            res.sendStatus(403);
            return;
        }
    }
    next();
}

async function _checkUserPermissions(req, permissions, resourceUri){

    const type = req.params.type;
    const method = req.method;

    let userPermUri = client.permissionGraph() + '/' + req.userId + '/' + type;

    let allowed = false;

    switch (method) {
        //Check create permissions 
        case 'POST':
        userPermUri += '/Create';
        allowed = permissions.includes(rdf.quad(rdf.namedNode(userPermUri), ns.sioc('has_scope'), client.graph(type), client.permissionGraph()));
        break;

        case 'PUT':
        // if(req.params.id) will disappear when graph API is implemented
        //Check edit permissions
        if (req.params.id){
            userPermUri += '/Edit';
            allowed = permissions.includes(rdf.quad(rdf.namedNode(userPermUri), ns.sioc('has_scope'), rdf.namedNode(resourceUri), client.permissionGraph()));
        }
        break;

        //Check read permissions
        case 'GET':
        userPermUri += '/Read';
        //If req.params.id = undefined means the request is graph wide
        //TODO: change this with GRAPH TYPE API Implementation
        if (!req.params.id){
            //TODO: change subject and use userPermUri
            let permUri = _permUri(req.userId, req.params.type, 'Read');
            let quadStream = store.match(permUri, ns.sioc('has_scope'), null, client.permissionGraph());
            let quadDataset = await rdf.dataset().import(quadStream);
            let authorizedUris = [];
            quadDataset.forEach(quad => {
                if (quad.object.value != client.graph(type)){
                    authorizedUris.push(quad.object);
                }
            })
            if (authorizedUris.length > 0){
                req.permList = authorizedUris;
                allowed = true;
            } else {
                allowed = false;
            }
        } else {
            //Check if resource is Public, if public then everyone can read it
            // if (await _isResourcePublic(resourceUri, client.graph(type))){
            //     allowed = true;
            // } else {
                allowed = permissions.includes(rdf.quad(rdf.namedNode(userPermUri), ns.sioc('has_scope'), rdf.namedNode(resourceUri), client.permissionGraph()));
            // }
        }
        break;

        //Check delete permissions
        case 'DELETE':
            userPermUri += '/Delete';
            allowed = permissions.includes(rdf.quad(rdf.namedNode(userPermUri), ns.sioc('has_scope'), rdf.namedNode(resourceUri), client.permissionGraph()));
        break;

        default:
            res.sendStatus(405)
            return;
    }
    return allowed;
}


async function _getResourcePermissions(resourceId, type){
    let resourceUri = resourceId ? client.graph(type).value + '/' + resourceId : client.graph(type).value;
    
    let permissionStream = store.match(null, ns.sioc('has_scope'), rdf.namedNode(resourceUri), client.permissionGraph());
    let permissionQuads = await rdf.dataset().import(permissionStream);
    return permissionQuads;
}

async function _isResourcePublic(resourceUri, graph){
    let allowedStream = store.match(rdf.namedNode(resourceUri), ns.pair('isPublic'), rdf.literal("1"), graph);
    let allowedGraph = await rdf.dataset().import(allowedStream);
    if(allowedGraph.length != 0){
        log("Is public !");
        return true;
    }
    return false;
}

async function _isResourcePrivateForUser(resourceUri, userId, graph){
    let protectedStream = store.match(rdf.namedNode(resourceUri), ns.pair('isProtected'), rdf.literal("1"), graph);
    let protectedGraph = await rdf.dataset().import(protectedStream);
    if(protectedGraph.length != 0){
        log("Is protected !");
        //TODO: Change this into organization permissions (UserGroups)
        // if (isCreator.length != 0){
        //     return false;
        // }
        // else {
        //     return true;
        // }
        return true;
    }
    return false;
}

function _userUri(userId){
    return rdf.namedNode(client.securityGraph() + client.userSuffix + userId);
}

function _permUri(userId, type, permission){
    return rdf.namedNode(client.permissionGraph().value + '/' + userId + '/' + type + '/' + permission);
}