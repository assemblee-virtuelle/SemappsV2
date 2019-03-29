const rdf = require('rdf-ext');
const ns = require('../utils/namespaces')
const log = require('debug')('semapps:security');
const errlog = require('debug')('semapps:error');

module.exports = class {
    constructor(client){
        this.store = client.store;    
        this.sGraph = client.securityGraph();
        this.client = client;
        this.permissionsAtCreate = ['Read', 'Write', 'Create', 'Delete', 'Edit']; //TODO: Change this for object key value in config
        this.pGraph = client.permissionGraph();
        this.securityUri = "";
    }

    async userExist(id){
        
    }

    _getTypeFromResource(resource){
        let uri = resource.slice(-1) == '/' ? resource.slice(0, -1) : resource;
        let re = new RegExp(/^(.*[\\\/])/);

        let trimmedUri = uri.match(re);
        if (trimmedUri[1] == this.client.graphEndpoint || trimmedUri[1].slice(0, -1) == this.client.graphEndpoint ){
            let type = uri.match(/\/([^\/]+)[\/]?$/);
            return type[1];
        } else {
            let type = trimmedUri[1].match(/\/([^\/]+)[\/]?$/);
            return type[1];
        }
    }

    async getPermissions(id, resource, permission){
        let type = this._getTypeFromResource(resource);
        let constructed = await this._getPermissionsUri(id, type, permission);
        if (constructed){
            let accessStream = this.store.match(rdf.namedNode(constructed), ns.sioc('has_scope'), rdf.namedNode(resource), this.pGraph)
            
            let accessQuads = await rdf.dataset().import(accessStream);
            if (accessQuads && accessQuads.length != 0){
                log(`${permission} access to ${type} Granted !`)
                return Promise.resolve(accessQuads);
            }
        }
    }

    async hasTypePermission(id, type, permission){
        let constructed = await this._getPermissionsUri(id, type, permission);

        if (constructed){
            let accessStream =  this.store.match(rdf.namedNode(constructed), ns.sioc('has_scope'), this.client.graph(type), this.pGraph)
            let accessQuads = await rdf.dataset().import(accessStream);
            if (accessQuads && accessQuads.length != 0){
                log(`${permission} access to ${type} Granted !`)
                return Promise.resolve(true)
            }
        }
        log(`${permission} access to ${type} denied`);
        return Promise.resolve(false);
    }

    async hasPermission(id, resource, type, permission){
        let accorded = await this.hasTypePermission(id, type, permission);
        if (accorded == false){
            let constructed = await this._getPermissionsUri(id, type, permission);
            if (constructed){
                let accessStream = this.store.match(rdf.namedNode(constructed), ns.sioc('has_scope'), rdf.namedNode(resource), this.pGraph)
                let accessQuads = await rdf.dataset().import(accessStream);
                if (accessQuads && accessQuads.length != 0){
                    log(`${permission} access to ${resource} Granted !`)
                    return Promise.resolve(true)
                } 
            } 
        } else {
            log(`${permission} access to ${resource} granted !`);
            return Promise.resolve(true)
        }
        log(`${permission} access to ${resource} denied`)        
        return Promise.resolve(false);
    }

    async createNewPermResource(userId, resource, type){
        //Check if userId has create control over the type
        //If he has control, do not create permission but still create a link to creator_of
        let editor = true;
        let promises = [];

        if (!editor){
            let perms = this.permissionsAtCreate;
            perms.forEach(permission => {
                promises.push(this.addPerm(userId, resource, type, permission));
            })
        }
        try {
            let dataset = rdf.dataset([rdf.quad(this._userUri(userId), ns.sioc('creator_of'), rdf.namedNode(resource))], this.sGraph);
            await this.store.import(dataset.toStream());
        } catch (error) {
            errlog('error :', error)
        }
        return new Promise((resolve, reject) => {
            Promise.all(promises).then((res) => {
                resolve(true);
            })
            .catch(err => {
                reject(err);
                errlog(err)
            })
        })
    }


    createDefaultPermissions(userUri, id, types, permissions){ //Doublon avec addPerm ?
        let quads = [];
        types.forEach(type => {
            permissions.forEach(perm => {
                let nPerm = this._permUri(id, type, perm);
                quads.push(rdf.quad(userUri, ns.sioc('has_function'), nPerm, this.sGraph));
                quads.push(rdf.quad(nPerm, ns.rdf('Type'), ns.sioc('Role'), this.pGraph));
                quads.push(rdf.quad(nPerm, ns.access('has_permission'), rdf.namedNode('http://virtual-assembly.org/' + perm), this.pGraph));
                quads.push(rdf.quad(nPerm, ns.sioc('has_scope'), this.client.graph(type), this.pGraph));
            })
        })
        return quads;
    }

    async addPerm(userId, resource, type, permission){
        //Add permission
        let quads = [];

        let userUri = this._userUri(userId);
        let nPerm = this._permUri(userId, type, permission);

        if (permission && this.permissionsAtCreate.includes(permission)){
            quads = [
                rdf.quad(nPerm, ns.rdf('Type'), ns.sioc('Role')),
                rdf.quad(nPerm, ns.access('has_permission'), rdf.namedNode('http://virtual-assembly.org/' + permission)),
                rdf.quad(nPerm, ns.sioc('has_scope'), rdf.namedNode(resource)), 
            ]
        }

        let graph = rdf.graph(quads);
        let newPerms = rdf.dataset(graph, this.pGraph)
        newPerms.add(rdf.quad(userUri, ns.sioc('has_function'), nPerm, this.sGraph));
        let stream = "";
        stream = this.store.import(newPerms.toStream());
        return new Promise((resolve, reject) => {
            rdf.waitFor(stream).then(err => {
                resolve(true);
            })
        })
    }

    async _getPermissionsUri(id, type, permission){
        let userUri = this._userUri(id);
        let permStream = this.store.match(userUri, ns.sioc('has_function'), null, this.sGraph);
        let permDataset = await rdf.dataset().import(permStream);
        let constructed = this._permUri(id, type, permission);
        let ok = false;
        permDataset.forEach(quad => {
            if (constructed == quad.object.value){
                ok = true;
            }
        });
        if (ok)
            return constructed;
        return null;
    }

    _permUri(userId, type, permission){
        return rdf.namedNode(this.pGraph.value + '/' + userId + '/' + type + '/' + permission);
    }

    _userUri(userId){
        return rdf.namedNode(this.sGraph + this.client.userSuffix + userId);
    }

    removePerm(userId, resource, permission){
        //Remove permission
    }


}