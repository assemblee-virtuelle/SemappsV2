let request = require("supertest")
let expect = require('chai').expect;
let tests = require('../testUtils');
require('./user.test');


describe('Resource API', () => {
    let app = tests.app;
    let id = "";
    let resourceUri = "";
    let user = {};

    before(done => {
        user = tests.user;
        id = user.id;
        done();
    })

    it('Creates a new resource', done => {
        let {type, payload, resource2} = tests.resource;
        let requestData = {
            resourceType:type,
            resourceData:payload
        }
        let requestData2 = {
            resourceType:type,
            resourceData:resource2
        }

        app.post('/v1/resource/new')
        .set('Accept', /application\/json/)
        .set('Authorization', `Bearer ${id}`)
        .send(requestData)
        .expect(200, (err, res) => {
            resourceUri = res.body.uri;
            if (err) { return done(err); }
            done();
        })

        // app.post('/v1/resource/new')
        // .set('Accept', /application\/json/)
        // .set('Authorization', `Bearer ${id}`)
        // .send(requestData2)
        // .expect(200, (err, res) => {
        //     resourceUri = res.body.uri;
        //     if (err) { return done(err); }
        //     done();
        // })
    })

    it('Show a list of resources', done => {
        //ResourceUri = http://127.0.0.1:3001/v1/resource/{type}/{id}
        let type = tests.resource.type;
        app
        .get(`/v1/resource/${type}`)
        .set('Accept', /application\/json/)
        .set('Authorization', `Bearer ${id}`)
        .expect('Content-Type', /application\/json/)
        .expect(200, (err, res) => {
            if(err) {return done(err);}
            done();
        })
    })

    it('Show a resource', done => {
        //ResourceUri = http://127.0.0.1:3001/v1/resource/{type}/{id}
        request(resourceUri)
        .get('/')
        .set('Accept', /application\/json/)
        .set('Authorization', `Bearer ${id}`)
        .expect('Content-Type', /application\/json/)
        .expect(200, (err, res) => {
            if(err) {return done(err);}
            done();
        })
    })

    // it('Edit a resource', done => {
    //     done();
    // })

    // it('Deletes a resource', done => {
    //     done();
    // })


})