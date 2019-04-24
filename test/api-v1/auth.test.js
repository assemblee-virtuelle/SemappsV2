let expect = require('chai').expect;
let request = require("supertest")
let tests = require('../testUtils');

let app = tests.app;
let user = tests.user;

describe('Jena API', () => {
    let jena;
    let datasetName = "TestSemapps";

    before(done => {
        jena = request('http://localhost:3030');
        done();
    })

    it('Jena is running', (done) => {
        jena
        .get('/')
        .expect(200, (err, res) => {
            if(err) {return done(err);}
            done();
        })
    })

    it('Delete Dataset if exist', done => {
        jena
        .delete(`/$/datasets/${datasetName}`)
        .expect(404, (err, res) => {
            if(err && res.status !== 200) {
                return done(err);
            }
            done();
        })
    })

    it('Creates a dataset', done =>{
        jena
        .post(`/$/datasets`)
        .query(`dbType=mem&dbName=${datasetName}`)
        .expect(200, (err, res) => {
            if (err) {return done(err)}
            done();
        })
    })

})

it('Api is running', (done) => {
    app
    .get('/v1/api-docs')
    .set('Content-Type', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
        if (err) { return done(err); }
        // Done
        done();
    });
})

describe('Auth API', () => {

    it('Creates a new user', done => {
        app.post('/v1/auth/new')
        .set('Accept', /application\/json/)
        .send(user)
        .expect(201, (err, res) => {
            if(err) { return done(err); }
            tests.user.id = res.body.id;
            done();
        })
    })

    it('Check if email exist', done => {
        app.post('/v1/auth/new')
        .set('Accept', /application\/json/)
        .send(user)
        .expect(409, (err, res) => {
            if(err) { return done(err); }
            done();
        })
    })

    it('Logs in', done => {
        app.post('/v1/auth/login')
        .send({
            password:user.password,
            email:user.email
        })
        .expect('Content-Type', /application\/json/)
        .expect(200, (err, res) => {
            
            if (err) { return done(err);}
            done();
        })
    })

    it('Wrong password', done => {
        app.post('/v1/auth/login')
        .send({
            password:user.password + "erer",
            email:user.email
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .end((err, res) => {
            if (err) { return done(err);}
            done();
        })
    })

    it('Nothing given on login', done => {
        app.post('/v1/auth/login')
        .send({
            password:'',
            email:''
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
        .end(err => {
            if (err) { return done(err);}
            done();
        })
    })

    //Do that in last
    // it('Deletes an user', done => {
    //     let toDelete = {
    //         email:user.email,
    //         password:user.password,
    //     }
    //     app.post('/v1/user/delete')
    //     .set('Accept', /application\/json/)
    //     .set('Authorization', `Basic ${id}`)
    //     .send(toDelete)
    //     .expect(200, (err, res) => {
    //         if (err) { return done(err); }
    //         done();
    //     })
    // })
})