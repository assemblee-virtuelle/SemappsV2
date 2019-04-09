let request = require("supertest")
let expect = require('chai').expect;
let tests = require('../testUtils');
require('./user.test');


describe('Resource API', () => {
    let app = tests.app;
    let id = "";
    let resourceUri = "";
    let resourceId = "";
    let user = {};
    let {type, payload, resource2, resource3} = tests.resource;


    before(done => {
        user = tests.user;
        id = user.id;
        done();
    })

    it('Creates a new resource', done => {

        app.post(`/v1/resource/${type}`)
        .set('Accept', /application\/json/)
        .set('Authorization', `Bearer ${id}`)
        .send(payload)
        .expect(200)
        .end((err, res) => {
            if (err) { return done(err); }
            resourceUri = res.body.uri;
            resourceId = res.body.id;
            done();
        })

    })

    it('Show a list of resources', done => {
        //ResourceUri = http://127.0.0.1:3001/v1/resource/{type}/{id}
        app
        .get(`/v1/resource/${type}`)
        .set('Accept', /application\/json/)
        .set('Authorization', `Bearer ${id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .end((err, res) => {
            if(err) {return done(err);}
            expect(res.body).to.not.be.empty;
            done();
        })
    })

    it('Show a resource', done => {
        //ResourceUri = http://127.0.0.1:3001/v1/resource/{type}/{id}
        app
        .get(`/v1/resource/${type}/${resourceId}`)
        .set('Accept', /application\/json/)
        .set('Authorization', `Bearer ${id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .end((err, res) => {
            if(err) {return done(err);}
            expect(res.body).to.not.be.empty;
            done();
        })
    })

    it('Edit a resource', done => {

        app
        .put(`/v1/resource/${type}/${resourceId}`)
        .set('Accept', /application\/json/)
        .set('Authorization', `Bearer ${id}`)
        .send(resource2)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .end((err, res) => {
            if(err){return done(err)};
            done()
        })
    })

    // it('Delete triples of a resource', done => {

    //     app
    //     .delete(`/v1/resource/${type}/${resourceId}`)
    //     .set('Accept', /application\/json/)
    //     .set('Authorization', `Bearer ${id}`)
    //     .send(resource3)
    //     .expect('Content-Type', /application\/json/)
    //     .expect(200)
    //     .end((err, res) => {
    //         if(err){return done(err)};
    //         done()
    //     })
    // })


})