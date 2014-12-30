/**
 * Created by anthony on 12/30/14.
 */
'use strict';
var reqlib = require('app-root-path').require;
var dataseed = reqlib('/server/test/dataseed');
var app = reqlib('/server/app');
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var Q = require('Q');


exports.token = function() {
    var defferred = Q.defer();
    var token;
    var practiceToken;
    var dankysPracticeToken;


    describe('Populate Tokens', function() {
        /* These Variables need to be populated often */
        it("should log an admin in", function (done) {
            var user = {email: 'rizzo0917@gmail.com', password: 'PT4ExXEZ'};

            request(app)
                .post("/auth/local")
                .send(user)
                .expect(200)
                .end(function (err, res) {
                    token = res.body.token;
                    expect(token).to.not.be.undefined;
                    done();
                });
        });

        it("should log rza's practice user in", function (done) {
            var user = {email: 'test@test.com', password: 'test'};
            request(app)
                .post("/auth/practice")
                .send(user)
                .expect(200)
                .end(function (err, res) {
                    practiceToken = res.body.token;
                    expect(token).to.not.be.undefined;
                    done();
                });
        });

        it("should log dankys practice user in", function (done) {
            var user = {email: 'jpdanks@gmail.com', password: 'dankys'};
            request(app)
                .post("/auth/practice")
                .send(user)
                .expect(200)
                .end(function (err, res) {
                    dankysPracticeToken = res.body.token;
                    expect(token).to.not.be.undefined;
                    done();
                });
        });
    });
    return defferred.promise;

}