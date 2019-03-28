const rdf = require('rdf-ext');
const ns = require('../utils/namespaces')


module.exports = class {
    constructor(client){
        this.store = client.store;    
        this.sGraph = client.securityGraph();
        this.client = client;
        this.permissionsAtCreate = ['Read', 'Write', 'Create', 'Delete']; //TODO: Change this for object key value in config
        this.pGraph = client.permissionGraph();
    }

    async userExist(id){
        
    }

    createDefaultPermissions(userUri, types, permissions){ //Doublon avec addPerm ?
        let quads = [];
        types.forEach(type => {
            permissions.forEach(perm => {
                let nPerm = rdf.namedNode(this.pGraph.value + '/' + type + '/' + perm);
                quads.push(rdf.quad(userUri, ns.sioc('has_function'), nPerm, this.sGraph));
                quads.push(rdf.quad(nPerm, ns.rdf('Type'), ns.sioc('Role'), this.pGraph));
                quads.push(rdf.quad(nPerm, ns.access('has_permission'), rdf.namedNode('http://virtual-assembly.org/' + perm), this.pGraph));
                quads.push(rdf.quad(nPerm, ns.sioc('has_scope'), this.client.graph(type), this.pGraph));
            })
        })
        return quads;
    }

    async getPermissions(id, type, permission){
        let userUri = rdf.namedNode(this.sGraph.value + this.client.userSuffix + id);

        let permStream = this.store.match(userUri, ns.sioc('has_function'), null, this.sGraph);
        let permDataset = await rdf.dataset().import(permStream);
        let constructed = this.pGraph.value + '/' + type + '/' + permission;
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

    async hasTypePermission(id, type, permission){
        let constructed = await this.getPermissions(id, type, permission);
        if (constructed){
            let accessStream =  this.store.match(rdf.namedNode(constructed), ns.sioc('has_scope'), this.client.graph(type), this.pGraph)
            let accessQuads = await rdf.dataset().import(accessStream);
            if (accessQuads && accessQuads.length != 0){
                console.log(`Access to ${type} Granted !`)
                return Promise.resolve(true)
            }
        }
        console.log(`Access to ${type} denied`)
        return Promise.resolve(false);
    }

    async hasPermission(id, resource, type, permission){
        let accorded = await this.hasTypePermission(id, type, permission);
        if (accorded == true){
            let constructed = await this.getPermissions(id, type, permission);
            if (constructed){
                let accessStream =  this.store.match(rdf.namedNode(constructed), ns.sioc('has_scope'), this.client.graph(type), this.pGraph)
                let accessQuads = await rdf.dataset().import(accessStream);
                if (accessQuads && accessQuads.length != 0){
                    console.log(`Access to ${resource} Granted !`)
                    return Promise.resolve(true)
                } 
            } 
        }
        console.log(`Access to ${resource} denied`)        
        return Promise.resolve(false);
    }

    async createNewResource(userId, resource, type){
        let perms = this.permissionsAtCreate;
        let promises = [];
        perms.forEach(permission => {
            promises.push(this.addPerm(userId, resource, type, permission));
        })
        return new Promise((resolve, reject) => {
            Promise.all(promises).then((res) => {
                resolve(true);
            });

        })
    }

    async addPerm(userId, resource, type, permission){
        //Add permission
        let quads = [];

        let userUri = this.sGraph + this.client.userSuffix + userId;
        let nPerm = rdf.namedNode(this.pGraph.value + '/' + type + '/' + permission);

        if (permission && this.permissionsAtCreate.includes(permission)){
            quads = [
                rdf.quad(nPerm, ns.rdf('Type'), ns.sioc('Role')),
                rdf.quad(nPerm, ns.access('has_permission'), rdf.namedNode('http://virtual-assembly.org/' + permission)),
                rdf.quad(nPerm, ns.sioc('has_scope'), rdf.namedNode(resource)), 
            ]
        }

        let graph = rdf.graph(quads);
        let newPerms = rdf.dataset(graph, this.pGraph)
        newPerms.add(rdf.quad(rdf.namedNode(userUri), ns.sioc('has_function'), nPerm, this.sGraph));
        let stream = "";
        stream = this.store.import(newPerms.toStream());
        return new Promise((resolve, reject) => {
            rdf.waitFor(stream).then(err => {
                resolve(true);
            })
        })
    }

    removePerm(userId, resource, permission){
        //Remove permission
    }


}