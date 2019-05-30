const rdf = require('rdf-ext');
const ns = require('../utils/namespaces')
const log = require('debug')('semapps:security');
const errlog = require('debug')('semapps:error');
const Serializer = require('@rdfjs/serializer-jsonld');
const serializer = new Serializer();

let store = null;
let client = null;

/**
 * @description Check if user has Control right 
 */
module.exports = async function checkPermissionAccess(req, res, next){
    let permissions = null;
    let allowed = false;
    let userPermUri = resourceUri = "";
    let type = req.params.type;
    let permissionsArr = [];
    client = req.client;
    store = req.store;

    if (req.userId){
        userPermUri = client.permissionGraph() + '/' + req.userId + '/' + type + '/Control';
        permissions = await _getResourcePermissions(req.params.id, type);
        resourceUri = client.graph(type).value + '/' + req.params.id;
        allowed = permissions.includes(rdf.quad(rdf.namedNode(userPermUri), ns.sioc('has_scope'), rdf.namedNode(resourceUri), client.permissionGraph()));
    }
    if (!allowed){
        res.sendStatus(403);
        return;
    } else {
        //TODO: move this into securityService
        //Remove all self permissions ?
        //permissions.removeMatches(rdf.namedNode(userPermUri), ns.sioc('has_scope'), null, client.permissionGraph())

        permissions.forEach(quad => {
            permissionsArr.push(quad.subject.value);
        })
        req.permList = permissionsArr;
    }
    next();

}

async function _getResourcePermissions(resourceId, type){
    let resourceUri = resourceId ? client.graph(type).value + '/' + resourceId : client.graph(type).value;
    
    let permissionStream = store.match(null, ns.sioc('has_scope'), rdf.namedNode(resourceUri), client.permissionGraph());
    let permissionQuads = await rdf.dataset().import(permissionStream);
    return permissionQuads;
}