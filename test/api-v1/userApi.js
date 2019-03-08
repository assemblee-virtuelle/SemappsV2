let express = require('express');
let request = require('supertest');
let expect = require('chai').expect;
let app = require('../server');
const bcrypt = require('bcrypt');
const saltRounds = 10;


describe('API', () => {
    let user;

    before(done => {

        app = request(app);
        done();
    })

    it('Jena is running', (done) => {
        request('http://localhost:3030')
        .get('/')
        .expect(200, (err, res) => {
            if(err) {return done(err);}
            done();
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

        it('Creates a new user', done => {
            app.post('/v1/user/new')
            .send({
                'username':'toto',
                'email':'toto@test.fr',
                'password':'test'
            })
            .set('Accept', 'application/json')
            .expect(201, (err, res) => {
                if(err) { return done(err); }
                console.log('res :', res.text);
                done();
            })
        })

        it('Check if email exist', done => {
            let data = {
                "username":"samy",
                "email":"samy@samy.fr",
                "password":"test"
            }
            app.post('/v1/user/new')
            .send(data)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(409, (err, res) => {
                if(err) { return done(err); }
                console.log('res :', res.text);
                done();
            })
        })

        it('Return a list of user', done => {
            let data = {
                "filter":"samy",
                "tho":"pouet"
            }

            app.get('/v1/users')
            .type('form')
            .set('Accept', 'application/json')
            .send(JSON.stringify(data))
            .expect('Content-Type', /json/)
            .expect(200, function(err, res) {
                if(err) { return done(err); }
                console.log('res :', res);
                done();
            })
        })
    })
})