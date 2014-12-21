/**
 * Created by anthony on 12/21/14.
 */
'use strict';

var should = require('should');
var app = require('./app');
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

describe('GET /*', function() {
    it('should respond index.html', function(done) {
        request(app)
            .get('/endpointthatwillneverexist')
            .expect(200)
            .expect('Content-Type', "text/html; charset=UTF-8")
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.text.indexOf("</html>")).to.be.above(-1);
                done();
            });
    });
});