let expect = require('chai').expect;
let request = require("supertest")
let server = require('../../app');


describe('API', () => {
    let user;
    let app;

    before(done => {
        app = request.agent(server.listen(3000));
        done();
    })

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

        user = {
            username:"samy",
            email:"samy@samy.fr",
            password:'test'
        } //TODO: seed the user

        let id = "";

        it('Creates a new user', done => {
            app.post('/v1/user/new')
            .send(user)
            .set('Accept', /application\/json/)
            .expect(201, (err, res) => {
                if(err) { return done(err); }
                id = res.body.id
                done();
            })
        })

        it('Logs in', done => {
            app.post('/auth/login')
            .send({
                password:user.password,
                email:user.email
            })
            .expect(200, (err, res) => {
                if (err) { return done(err);}
                done();
            })
        })

        it('Check if email exist', done => {
            app.post('/v1/user/new')
            .send(user)
            .set('Accept', /application\/json/)
            .expect(409, (err, res) => {
                if(err) { return done(err); }
                done();
            })
        })

        it('Return a single User', done => {
            app.get(`/v1/user/${id}`)
            .expect('Content-Type', /json/)
            .expect(200, function(err, res) {
                if(err) { return done(err); }
                done();
            })
        })

        it('Deletes an user', done => {
            let toDelete = {
                email:user.email,
                password:user.password,
                id:id
            }
            app.post('/v1/user/delete')
            .set('Accept', /application\/json/)
            .send(toDelete)
            .expect(200, (err, res) => {
                if (err) { return done(err); }
                done();
            })
        })
    })
})