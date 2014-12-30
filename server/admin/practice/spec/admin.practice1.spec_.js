'use strict';
var reqlib = require('app-root-path').require;
var dataseed = reqlib('/server/test/dataseed');
var logintoken = reqlib('/server/test/logintoken');
var app = reqlib('/server/app');
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

var token;
var practiceToken;
var dankysPracticeToken;

logintoken.token(function(t, pt, dpt) {
    token = t;
    practiceToken = pt;
    dankysPracticeToken = dpt;
})


describe('GET /admin/practice', function() {

    it("should list user info", function (done) {
        var agent = request.agent(app);
        agent
            .get("/admin/practice")
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                console.log(res.body.length);
                done();
            });
    });
});



