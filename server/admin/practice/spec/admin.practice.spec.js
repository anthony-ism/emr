'use strict';
var reqlib = require('app-root-path').require;
var dataseed = reqlib('/server/test/dataseed');
var app = reqlib('/server/app');
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;
dataseed.seed();


it("should log an admin in", function (done) {
    var user = {email: 'rizzo0917@gmail.com', password: 'PT4ExXEZ'};

    request(app)
        .post("/auth/local")
        .send(user)
        .expect(200)
        .end(function (err, res) {
            console.log("##########");
            console.log(res.body.token);
            token = res.body.token;
            done();
        });
});
