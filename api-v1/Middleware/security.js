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
    manageUserInfo
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
        req.client = req.app.get('store');
        req.store = req.client.store;
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
