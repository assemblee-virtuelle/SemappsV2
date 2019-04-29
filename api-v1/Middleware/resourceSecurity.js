const rdf = require('rdf-ext');
const ns = require('../utils/namespaces')
const log = require('debug')('semapps:security');

let store = null;
let client = null;

module.exports = async function checkResourceAccess(req, res, next){
    let permissions = null;
    let method = req.method;
    let allowed = false;
    client = req.client;
    store = req.store;

    if(req.userId){
        let type = req.params.type;
        let resourceUri;
        let userPermUri = client.permissionGraph() + '/' + req.userId + '/' + type;
        permissions = await _getResourcePermissions(req.userId, req.params.id, type);
        if (req.params.id){
            resourceUri = client.graph(type).value + '/' + req.params.id;
            //If resource is private and the user has no private rights on it (creator_of, etc (?)), return unauthorized
            if (await _isResourcePrivateForUser(resourceUri, req.userId, client.graph(type))){
                res.sendStatus(403);
                return;
            }
        }
        if (permissions.length == 0){
            res.sendStatus(403);
            return;
        }
        
        //TODO: check if API is permission, if in permission API, only check for CONTROL rights
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
                resourceUri = client.graph(type).value + '/' + req.params.id;
                allowed = permissions.includes(rdf.quad(rdf.namedNode(userPermUri), ns.sioc('has_scope'), rdf.namedNode(resourceUri), client.permissionGraph()));
            }
            break;

            //Check read permissions
            case 'GET':
            userPermUri += '/Read';
            //If req.params.id = undefined means the request is graph wide
            //TODO: change this with GRAPH API Implementation
            if (req.params.id === undefined){
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
                if (await _isResourcePublic(resourceUri, client.graph(type))){
                    next();
                    return;
                } else {
                    allowed = permissions.includes(rdf.quad(rdf.namedNode(userPermUri), ns.sioc('has_scope'), rdf.namedNode(resourceUri), client.permissionGraph()));
                }
            }
            break;

            //Check delete permissions
            case 'DELETE':
            userPermUri += '/Delete';
            resourceUri = client.graph(type).value + '/' + req.params.id;
            allowed = permissions.includes(rdf.quad(rdf.namedNode(userPermUri), ns.sioc('has_scope'), rdf.namedNode(resourceUri), client.permissionGraph()));
            break;

            default:
                res.sendStatus(405)
                return;
        }
        if (!allowed){
            res.sendStatus(403);
            return;
        }
    }
    next();
}

async function _getResourcePermissions(userId, resourceId, type){
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
        let isCreator = await rdf.dataset().import(store.match(_userUri(userId), ns.sioc('creator_of'), rdf.namedNode(resourceUri)));
        if (isCreator.length != 0){
            return false;
        }
        else {
            return true;
        }
    }
    return false;
}

function _userUri(userId){
    return rdf.namedNode(client.securityGraph() + client.userSuffix + userId);
}

function _permUri(userId, type, permission){
    return rdf.namedNode(client.permissionGraph().value + '/' + userId + '/' + type + '/' + permission);
}