const rdf = require('rdf-ext');
const ns = require('../utils/namespaces')
const log = require('debug')('semapps:security');
const errlog = require('debug')('semapps:error');

module.exports = class {
    constructor(client){
        this.store = client.store;    
        this.sGraph = client.securityGraph();
        this.client = client;
        this.permissionsAtCreate = ['Read', 'Create', 'Delete', 'Edit']; //TODO: Change this for object key value in config
        this.pGraph = client.permissionGraph();
        this.securityUri = "";
    }

    // async createNewPermResource(userId, resource, type){
    //     //Check if userId has create control over the type
    //     //If he has control, do not create permission but still create a link to creator_of
    //     let editor = true;
    //     let promises = [];

    //     if (!editor){
    //         let perms = this.permissionsAtCreate;
    //         perms.forEach(permission => {
    //             promises.push(this.addPerm(userId, resource, type, permission));
    //         })
    //     }
    //     try {
    //         let dataset = rdf.dataset([rdf.quad(this._userUri(userId), ns.sioc('creator_of'), rdf.namedNode(resource))], this.sGraph);
    //         await this.store.import(dataset.toStream());
    //     } catch (error) {
    //         errlog('error :', error)
    //     }
    //     return new Promise((resolve, reject) => {
    //         Promise.all(promises).then((res) => {
    //             resolve(true);
    //         })
    //         .catch(err => {
    //             reject(err);
    //             errlog(err)
    //         })
    //     })
    // }

    createDefaultPermissions(resourceId, userId, types, permissions){
        let quads = [];
        types.forEach(type => {
            let resourceUri = resourceId ? this.client.graph(type).value + '/' + resourceId : this.client.graph(type).value;
            permissions.forEach(perm => {
                let nPerm = this._permUri(userId, type, perm);
                let userUri = this._userUri(userId);
                quads.push(rdf.quad(userUri, ns.sioc('has_function'), nPerm, this.sGraph));
                quads.push(rdf.quad(nPerm, ns.rdf('Type'), ns.sioc('Role'), this.pGraph));
                quads.push(rdf.quad(nPerm, ns.access('has_permission'), rdf.namedNode('http://virtual-assembly.org/' + perm), this.pGraph));
                quads.push(rdf.quad(nPerm, ns.sioc('has_scope'), rdf.namedNode(resourceUri), this.pGraph));
            })
        })
        return quads;
    }

    async editPermissions(resourceId, userId, types, permissions){
        return new Promise((resolve, reject) => {resolve()})

    }

    async addPerm(userId, resourceUri, type, permissions){
        //Add permission
        let quads = [];
        let userUri = this._userUri(userId);
        let nPerm = this._permUri(userId, type, permissions);
        
        if(!permissions.isEmpty()){
            permissions.forEach(perm => {
                if (perm && this.permissionsAtCreate.includes(perm)){
                    quads = [
                        rdf.quad(userUri, ns.sioc('has_function'), nPerm, this.sGraph),
                        rdf.quad(nPerm, ns.rdf('Type'), ns.sioc('Role'), this.pGraph),
                        rdf.quad(nPerm, ns.access('has_permission'), rdf.namedNode('http://virtual-assembly.org/' + perm), this.pGraph),
                        rdf.quad(nPerm, ns.sioc('has_scope'), rdf.namedNode(resourceUri), this.pGraph), 
                    ]
                }
            })
        }
        let newPerms = rdf.dataset(quads)
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