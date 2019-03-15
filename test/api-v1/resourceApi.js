let request = require("supertest")
let expect = require('chai').expect;
let tests = require('../tests');
require('./userApi');


describe('Resource API', () => {
    let app = tests.app;
    let id = ""

    before(done => {
        let user = tests.user;
        id = user.id;
        done();
    })

    it('Creates a new resource', done => {

        app.post('/v1/resource/new')
        .set('Accept', /application\/json/)
        .set('Authorization', `Basic ${id}`)
        done()
    })

})