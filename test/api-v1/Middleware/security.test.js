let expect = require('chai').expect;
let request = require("supertest")
var tests = require('../../testUtils');

require('../path/sparql.test');
let app = tests.app;
let users = tests.users;

describe('Security Middleware', () => {
    let jena;
    let datasetName = "TestSemapps";

    // before(done => {
    //     jena = request('http://localhost:3030');
        
    //     jena
    //     .delete(`/$/datasets/${datasetName}`)
        
    //     jena
    //     .post(`/$/datasets`)
    //     .query(`dbType=mem&dbName=${datasetName}`)

    //     done();
    // })

    it('Creates three users (future: an Admin, an Editor and a User)', (done) => {
        app.post('/v1/auth/new')
        .set('Accept', /application\/json/)
        .send(users[0])
        .expect(201, (err, res) => {
            if(err) { return done(err); }
            tests.users[0].id = res.body.id;
            app.post('/v1/auth/new')
            .set('Accept', /application\/json/)
            .send(users[1])
            .expect(201, (err, res) => {
                if(err) { return done(err); }
                tests.users[1].id = res.body.id;
                app.post('/v1/auth/new')
                .set('Accept', /application\/json/)
                .send(users[2])
                .expect(201, (err, res) => {
                    if(err) { return done(err); }
                    tests.users[2].id = res.body.id;
                    done();
                })
            })
        })
    })
})