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

    createDefaultPermissions(resourceId, userId, types, permissions){
        let quads = [];
        types.forEach(type => {
            let resourceUri = resourceId ? this.client.graph(type).value + '/' + resourceId : this.client.graph(type).value;
            permissions.forEach(perm => {
                let nPerm = this._permUri(userId, type, perm);
                let userUri = this._userUri(userId);
                quads.push(rdf.quad(userUri, ns.sioc('has_function'), nPerm, this.sGraph));
                quads.push(rdf.quad(nPerm, ns.sioc('has_scope'), rdf.namedNode(resourceUri), this.pGraph));
                quads.push(rdf.quad(nPerm, ns.rdf('Type'), ns.sioc('Role'), this.pGraph));
                quads.push(rdf.quad(nPerm, ns.access('has_permission'), rdf.namedNode('http://virtual-assembly.org/' + perm), this.pGraph));
            })
        })
        return quads;
    }

    async _editToRemove(permList, permInput, type, resourceUri){
        let toDelete = [];
        let permArr = this._formatPermissions(permList);
        //Compare to input user array
        await this._asyncForEach(permInput, async inputUserPerm => {
            let id = inputUserPerm.id;
            let toDelete = [];
            //Loop for each user
            permArr.forEach(userPerm => {
                if (userPerm.id === id){
                    toDelete = userPerm.permissions.filter(perm =>{
                        return inputUserPerm.permissions.includes(perm) ? 0 : 1;
                    })
                }
            })
            await this._asyncForEach(toDelete, async perm =>{
                let permUri = this._permUri(id, type, perm);
                await this.store.removeMatches(permUri, ns.sioc('has_scope'), rdf.namedNode(resourceUri), this.pGraph)
            })
        })
    }

    async edit(req){
        let permissionSet = req.body;
        let type = req.params.type;
        let resourceId = req.params.id;
        let datasetPerm = rdf.dataset();
        let datasetSecu = rdf.dataset();

        let resourceUri = this.client.graph(type).value + '/' + resourceId;
        let permList = req.permList;

        // let quads = [];
        let usersDatasetStream = this.store.match(null, ns.rdf('Type'), ns.sioc('UserAccount'), this.sGraph);
        let usersDataset = await rdf.dataset().import(usersDatasetStream);
        if(permissionSet && permissionSet.length != 0){
            await this._asyncForEach(permissionSet, async permission => {
                let userUri = this._userUri(permission.id)
                await this._asyncForEach(permission.permissions, async perm => {
                    let nPerm = this._permUri(permission.id, type, perm)
                    let userExistQuads = usersDataset.match(userUri, ns.rdf('Type'), ns.sioc('UserAccount'), this.sGraph);
                    if (userExistQuads.length != 0){
                        datasetSecu.add(rdf.quad(userUri, ns.sioc('has_function'), nPerm, this.sGraph));
                        datasetPerm.add(rdf.quad(nPerm, ns.sioc('has_scope'), rdf.namedNode(resourceUri), this.pGraph));
                        datasetPerm.add(rdf.quad(nPerm, ns.rdf('Type'), ns.sioc('Role'), this.pGraph));
                        datasetPerm.add(rdf.quad(nPerm, ns.access('has_permission'), rdf.namedNode('http://virtual-assembly.org/' + perm), this.pGraph));
                    }
                })
            })
            if (datasetSecu.length != 0){
                let permStream = this.store.import(datasetPerm.toStream())
                try {
                    
                    await this._editToRemove(permList, permissionSet, type, resourceUri);
                } catch (error) {
                    console.log('error', error)
                }
                // let removeStream = this.store.remove()
                return new Promise((resolve, reject) => {
                    rdf.waitFor(permStream).then(() => {
                        let secuStream = this.store.import(datasetSecu.toStream());
                        rdf.waitFor(secuStream).then(() => {
                            resolve();
                        })
                    })
                })
            } else {
                return {error:'err', error_status:400, error_description:'error'}
            }
        } else {
            return {error:'err', error_status:400, error_description:'error'}
        }
    }

    async _asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    async create(req){
        let permissionSet = req.body;
        let type = req.params.type;
        let resourceId = req.params.id;
        let datasetPerm = rdf.dataset();
        let datasetSecu = rdf.dataset();

        let resourceUri = this.client.graph(type).value + '/' + resourceId;

        // let quads = [];
        let usersDatasetStream = this.store.match(null, ns.rdf('Type'), ns.sioc('UserAccount'), this.sGraph);
        let usersDataset = await rdf.dataset().import(usersDatasetStream);
        if(permissionSet && permissionSet.length != 0){
            await this._asyncForEach(permissionSet, async permission => {
                await this._asyncForEach(permission.permissions, async perm => {
                    let userUri = this._userUri(permission.id)
                    let nPerm = this._permUri(permission.id, type, perm)
                    let userExistQuads = usersDataset.match(userUri, ns.rdf('Type'), ns.sioc('UserAccount'), this.sGraph);
                    if (userExistQuads.length != 0){
                        datasetSecu.add(rdf.quad(userUri, ns.sioc('has_function'), nPerm, this.sGraph));
                        datasetPerm.add(rdf.quad(nPerm, ns.sioc('has_scope'), rdf.namedNode(resourceUri), this.pGraph));
                        datasetPerm.add(rdf.quad(nPerm, ns.rdf('Type'), ns.sioc('Role'), this.pGraph));
                        datasetPerm.add(rdf.quad(nPerm, ns.access('has_permission'), rdf.namedNode('http://virtual-assembly.org/' + perm), this.pGraph));
                    }
                })
            })
            if (datasetSecu.length != 0){
                let permStream = this.store.import(datasetPerm.toStream())
                return new Promise((resolve, reject) => {
                    rdf.waitFor(permStream).then(() => {
                        let secuStream = this.store.import(datasetSecu.toStream());
                        rdf.waitFor(secuStream).then(() => {
                            resolve();
                        })
                    })
                })
            } else {
                return {error:'err', error_status:400, error_description:'error'}
            }
        } else {
            return {error:'err', error_status:400, error_description:'error'}
        }
    }

    /**
     * @description Deletes permissions 
     * @param {*} req 
     */
    async delete(req){
        let userId = req.userId;
        let resourceId = req.params.id;
        let toDelete = req.body;

        let permArr = this._formatPermissions(req.permList);

        const resourceUri = this.client.graph(req.params.type).value + '/' + resourceId;
        let deleteDataset = rdf.dataset();
        //Verify uris
        await this._asyncForEach(toDelete, async deletePerm => {
            await this._asyncForEach(permArr, async userPerm => {
                if (userPerm.id === deletePerm){
                    await this._asyncForEach(userPerm.permissions, async perm => {
                        let permUri = this._permUri(userPerm.id, req.params.type, perm);
                        deleteDataset.add(rdf.quad(permUri, ns.sioc('has_scope'), rdf.namedNode(resourceUri), this.pGraph))
                        // await this.store.removeMatches(permUri, ns.sioc('has_scope'), rdf.namedNode(resourceUri), this.pGraph);
                    })
                }
            })
        })
        return new Promise((resolve, reject) => {
            //TODO: test timings
            if (deleteDataset.length !== 0){
                let deleteStream = this.store.remove(deleteDataset.toStream())
                rdf.waitFor(deleteStream).then(() => resolve());
            }
            else {
                resolve();
            }
        })
    }

    _formatPermissions(permissions){
        let userId = "";
        let len = 0;
        let permissionsArr = [];
        let added = false;
        permissions.forEach(uri => {
            let permission = uri.match(/([^\/]+$)/);
            //TODO: unhardcode userPermission or change this
            let tmpId = uri.match(/UserPermission.(.*?\/)/);
            if (permission && permission[1] && tmpId && tmpId[1]){
                let perm = permission[1];
                userId = tmpId[1].slice(0, -1);
                added = false;
                //TODO: optimize this
                for(let i = len; i >= 0; i--){
                    if (permissionsArr[i] && permissionsArr[i].id == userId){
                        permissionsArr[i].permissions.push(perm);
                        permissionsArr[i].id = userId;
                        added = true;
                    }
                }
                if (!added){
                    //TODO: Important ! replace id: with uri: 
                    permissionsArr[len] = {id:userId, permissions:[perm]}
                }
                len++;
            }
        });
        let trimmed = permissionsArr.filter(key => {
            return key != null;
        })
        return trimmed;
    }

    async get(req){

        let permissionsArr = this._formatPermissions(req.permList);

        return new Promise((resolve, reject) => {
            resolve(permissionsArr);
        })
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
}