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

        user = {
            username:"samy",
            email:"samy@samy.fr",
            password:'test'
        } //TODO: seed the user

        let id = "";

        it('Creates a new user', done => {
            app.post('/v1/user/new')
            .send(user)
            .type('form')
            .set('Accept', /application\/json/)
            .expect(201, (err, res) => {
                if(err) { return done(err); }
                id = res.body.id
                done();
            })
        })

        it('Check if email exist', done => {
            app.post('/v1/user/new')
            .type('form')
            .send(user)
            .set('Accept', /application\/json/)
            .expect(409, (err, res) => {
                if(err) { return done(err); }
                done();
            })
        })

        it('Return a single User', done => {
            console.log('id :', id)
            app.get(`/v1/user/${id}`)
            .expect('Content-Type', /json/)
            .expect(200, function(err, res) {
                if(err) { return done(err); }
                done();
            })
        })

        // it('Edit an user', done => {
        //     //Edit user
        //     done();
        // })

        it('Deletes an user', done => {
            app.get('/v1/user/delete')
            .set('Accept', /application\/json/)
            .query()
            .expect(200, (err, res) => {
                if (err) { return done(err); }
                done();
            })
        })
    })
})