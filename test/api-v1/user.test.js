let expect = require('chai').expect;
let request = require("supertest")
let tests = require('../testUtils');

let app = tests.app;
let user = tests.user;

describe('API', () => {

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
        .expect('Content-Type', /json/)
        .expect(200, function(err, res) {
          if (err) { return done(err); }
          // Done
          done();
        });
    })

    describe('User API', () => {
        let _user = {
            email:user.email,
            username:user.username,
            password:user.password,
        }

        let id = "";

        it('Creates a new user (auth)', done => {
            app.post('/v1/auth/new')
            .send(user)
            .set('Accept', /application\/json/)
            .expect(201, (err, res) => {
                if(err) { return done(err); }
                id = res.body.id
                tests.user.id = id;
                done();
            })
        })

        it('Check if email exist', done => {
            app.post('/v1/auth/new')
            .send(user)
            .set('Accept', /application\/json/)
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

        it('Creates the userInfo', done => {
            let profile = tests.profile;
            app.post('/v1/user/new')
            .set('Authorization', `Bearer ${id}`)
            .set('Accept', /application\/json/)
            .send(profile)
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .end((err,res) => {
                if (err) {return done(err);}
                done();
            })
        })

        it('Return a single User', done => {
            app.get(`/v1/user/${id}`)
            .set('Authorization', `Bearer ${id}`)
            .set('Accept', /application\/json/)
            .expect('Content-Type', /json/)
            .expect(200, function(err, res) {
                if(err) { return done(err); }
                done();
            })
        })

        it('Edit an user', done => {
            let profile = tests.profile2;
            app.put(`/v1/user/${id}`)
            .set('Authorization', `Bearer ${id}`)
            .set('Accept', /application\/json/)
            .send(profile)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {return done(err);}
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

    after((done) => {
        done();
    })
})