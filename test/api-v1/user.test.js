let expect = require('chai').expect;
let request = require("supertest")
var tests = require('../testUtils');

require('./auth.test');
let app = tests.app;
let user = tests.user;

describe('User API', () => {
    let _user = {
        email:user.email,
        username:user.username,
        password:user.password,
    }

    let id = "";

    it('Creates the userInfo', done => {
        id = user.id;
        let profile = tests.profile;
        app.post('/v1/user')
        .set('Authorization', `Bearer ${id}`)
        .set('Accept', /application\/json/)
        .send(profile)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .end((err,res) => {
            if (err) {return done(err);}
            done();
        })
    })

    it('Return a single User', done => {
        app.get(`/v1/user/${id}`)
        .set('Authorization', `Bearer ${id}`)
        .set('Accept', /application\/json/)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
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
        .expect(200)
        .expect('Content-Type', /json/)
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