let express = require('express');
let request = require('supertest');
let expect = require('chai').expect;
let app = require('../server');



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
        it('Create a new user', done => {
            app.get('/v1/users')
            
        })
    })

})