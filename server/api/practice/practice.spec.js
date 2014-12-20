'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var requestAgent = require('superagent');

describe('GET /api/practices', function() {

    /*
  it('should respond with JSON array', function(done) {
      var user1 = requestAgent.agent();
      user1
          .post('/auth/local')
          .send({ user: 'rizzo0917@gmail.com', password: 'PT4ExXEZ' })
          .end(function(err, res) {

              console.log(err)
              console.log(res)

              /*
              request(app)
                  .get('/api/practices')
                  .expect(200)
                  .expect('Content-Type', /json/)
                  .end(function(err, res) {
                      if (err) return done(err);
                      res.body.should.be.instanceof(Array);
                      done();
                  });*/


              // user1 will manage its own cookies
              // res.redirects contains an Array of redirects
          //});


  //});
});