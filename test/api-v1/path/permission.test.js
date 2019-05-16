let expect = require('chai').expect;
let request = require("supertest")
var tests = require('../../testUtils');

require('../Middleware/security.test');
let app = tests.app;
let users = "";

describe('Permissions API', () => {
    let id = "";
    let resourceUri = "";
    let resourceId = "";
    let user = {};
    let {type, payload, resource2, resource3} = tests.resource;

    before(done => {
        users = tests.users;
        resourceId = tests.resource.id;
        user = tests.user;
        id = user.id;
        done();
    })

    it('Has control over resource', (done) => {
        app.get(`/v1/perm/${type}/${resourceId}`)
        .set('Authorization', `Bearer ${id}`)
        .set('Accept', /application\/json/)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .end((err, res) => {
            if (err) {return done(err);}
            expect(res.body).not.to.be.empty;
            done();
        })
    })

    it('Adds new permission for a resource', done => {
        let newPerms = [
            {
                id:'asdasd',
                permissions:['Read', 'Write']
            },
            {
                id:users[0].id,
                permissions:['Control']
            },
            {
                id:users[1].id,
                permissions:['Read', 'Write', 'Control', 'Edit', 'Delete']
            }
        ]
        app.post(`/v1/perm/${type}/${resourceId}`)
        .set('Authorization', `Bearer ${id}`)
        .set('Accept', /application\/json/)
        .send(newPerms)
        .expect(200)
        .end((err, res) => {
            if (err) {return done(err);}
            else{
                app.get(`/v1/resource/${type}/${resourceId}`)
                .set('Authorization', `Bearer ${users[0].id}`)
                .set('Accept', /application\/json/)
                .expect(200)
                .end((err, res) => {
                    if (err) { return done(err); }
                    // console.log('res.body :', res.body)
                    done();
                })
            }
        })
    })

    it('Edits permissions of a resource', done => {
        let perms = [
            {
                id:users[0].id,
                permissions:['Read']
            }, {
                id:users[1].id,
                permissions:['Write', 'Read']
            }
        ]
        app.put(`/v1/perm/${type}/${resourceId}`)
        .set('Authorization', `Bearer ${id}`)
        .send(perms)
        .expect(200)
        .end((err,res) => {
            if (err) {return done(err)}
            done();
        })
    })

    it('Deletes permissions of a resource', done => {
        let perms = [users[0].id, users[2].id]
        app.delete(`/v1/perm/${type}/${resourceId}`)
        .set('Authorization', `Bearer ${id}`)
        .send(perms)
        .expect(200)
        .end((err, res) => {
            if (err) {return done(err)}
            done();
        })
    })
})