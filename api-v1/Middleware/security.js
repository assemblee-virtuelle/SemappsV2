const rdf = require('rdf-ext');
const ns = require('../utils/namespaces')
const log = require('debug')('semapps:security');
const errlog = require('debug')('semapps:error');
const Serializer = require('@rdfjs/serializer-jsonld');
const serializer = new Serializer();
let store = null;
let client = null;

module.exports = [
    headerValidation,
    isStoreDefined,
    manageUserInfo,
    getPermissionsOfResource,
    // permissionRessourceValidation,
    typeExists
]

/**
 * @description Check if header Authorization is present and sets
 * req.userId 
 */
function headerValidation(req, res, next){
    if (req.headers.authorization) {
        req.userId = req.headers.authorization.replace('Bearer ', '');
        next();
    } else {
        res.sendStatus(400).json({error:'Bad request', error_status:400, error_description:'Incorrect ID'});
    }
}

/**
 * @description Add specific type to userInfo for user api
 */
function manageUserInfo(req, res, next){
    //TODO: remove hardcoding
    if(req.path.substring(0, 8) == '/v1/user'){
        req.params.type = 'User';
    }
    next();
}

/**
 * @description Check if store is defined in req.app.get('store');
 */
function isStoreDefined(req, res, next){
    if (req.app.get('store')){
        client = req.app.get('store');
        store = client.store;
        next();
    }
    else{
        res.status(500).json({error:500, error_description:"Sparql store undefined"});
        return;
    }
}

//TODO: To move and finish
/**
 * @description Check if type is within the list of existing types
 */ 
function typeExists(req, res, next){
    next();
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

async function getPermissionsOfResource(req, res, next){
    let permissions = null;
    let method = req.method;
    let allowed = false;

    if(req.userId){
        let type = req.params.type;
        let resourceUri;
        let userPermUri = client.permissionGraph() + '/' + req.userId + '/' + type;
        permissions = await _getResourcePermissions(req.userId, req.params.id, type);
        if (req.params.id){
            resourceUri = client.graph(type).value + '/' + req.params.id;
            //If resource is private and the user has no private rights on it (creator_of, etc (?)), return unauthorized
            if (await _isResourcePrivateForUser(resourceUri, req.userId, client.graph(type))){
                console.log("eho")
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

// async function _hasListPermission(userId, type, permission){
//     let constructed = await _getPermissionsUri(userId, type, permission);
//     if (constructed){
//         let authorizedUris = [];
//         let accessStream = store.match(rdf.namedNode(constructed), ns.sioc('has_scope'), null, client.permissionGraph());
//         let accessQuads = await rdf.dataset().import(accessStream);
//         if (accessQuads && accessQuads.length != 0){
//             accessQuads.forEach(quad => {
//                 authorizedUris.push(quad.object);
//             })
//             log(`${permission} access to ${type} Granted !`)
//             return Promise.resolve(authorizedUris);
//         }
//         log(`${permission} access to ${type} denied`);
//         return Promise.resolve(false);
//     }
// }

// async function _hasTypePermission(id, type, permission){
//     let constructed = await _getPermissionsUri(id, type, permission);

//     if (constructed){
//         let accessStream = store.match(rdf.namedNode(constructed), ns.sioc('has_scope'), client.graph(type), client.permissionGraph());
//         let accessQuads = await rdf.dataset().import(accessStream);
//         if (accessQuads && accessQuads.length != 0){
//             log(`${permission} access to ${type} Granted !`)
//             return Promise.resolve(true)
//         }
//     }
//     log(`${permission} access to ${type} denied`);
//     return Promise.resolve(false);
// }

// async function _getPermissionsUri(id, type, permission){
//     let userUri = _userUri(id);
//     let permStream = store.match(userUri, ns.sioc('has_function'), null, client.securityGraph());
//     let permDataset = await rdf.dataset().import(permStream);
//     let constructed = _permUri(id, type, permission);
//     let ok = false;
//     permDataset.forEach(quad => {
//         if (constructed == quad.object.value){
//             ok = true;
//         }
//     });
//     if (ok)
//         return constructed;
//     return null;
// }

// async function _hasPermission(id, resource, type, permission){
//     let accorded = await _hasTypePermission(id, type, permission);
//     if (accorded == false){
//         let constructed = await _getPermissionsUri(id, type, permission);
//         if (constructed){
//             let resourceUri = resource ? client.graph(type).value + '/' + resource : client.graph(type).value;
//             let accessStream = store.match(rdf.namedNode(constructed), ns.sioc('has_scope'), rdf.namedNode(resourceUri), client.permissionGraph())
//             let accessQuads = await rdf.dataset().import(accessStream);
//             if (accessQuads && accessQuads.length != 0){
//                 log(`${permission} access to ${resource} Granted !`)
//                 return Promise.resolve(true)
//             } 
//         }
//     } else {
//         return Promise.resolve(true);
//     }
//     log(`${permission} access to ${resource} denied`)        
//     return Promise.resolve(false);
// }

function _userUri(userId){
    return rdf.namedNode(client.securityGraph() + client.userSuffix + userId);
}

function _permUri(userId, type, permission){
    return rdf.namedNode(client.permissionGraph().value + '/' + userId + '/' + type + '/' + permission);
}