let expect = require('chai').expect;
let request = require("supertest")
var tests = require('../testUtils');

require('./resource.test');
let app = tests.app;
let users = tests.users;

describe('Sparql service', () => {
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

    it('Does a select sparql query', (done) => {
        let query = `SELECT ?subject ?predicate ?object
        WHERE {
          GRAPH <http://localhost:3030/TestSemapps/data/User> {
            ?subject ?predicate ?object
          }
          
        }
        LIMIT 25`;
        app.post('/v1/sparql/select')
        .set('Authorization', `Bearer ${id}`)
        .set('Accept', /application\/json/)
        .query({'query':query})
        .expect(200)
        .end((err, res) => {
            if (err) {return done(err);}
            // console.log('res.body', res.body)
            done();
        })

    })
})