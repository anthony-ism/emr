'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var httpMocks = require('node-mocks-http');
var controller = require('./thing.controller');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

mockgoose(mongoose);
mockgoose.reset();


describe('GET /api/things', function() {
    it('should respond with JSON array', function(done) {
        request(app)
            .get('/api/things')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
            });
    });
});


describe('POST /api/things', function() {
    it('should respond with JSON array', function(done) {
        request(app)
            .post('/api/things')
            .send({"name": "test"})
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Object);
                done();
            });
    });
});

describe('GET /api/things', function() {
    it('should respond with JSON array', function(done) {
        request(app)
            .get('/api/things')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
            });
    });
});