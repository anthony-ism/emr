'use strict';
var reqlib = require('app-root-path').require;
var dataseed = reqlib('/server/test/dataseed');
var logintoken = reqlib('/server/test/logintoken');

var app = reqlib('/server/app');
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;
dataseed.seed();

var token;
var practiceToken;
var dankysPracticeToken;

logintoken.token(function(t, pt, dpt) {
    token = t;
    practiceToken = pt;
    dankysPracticeToken = dpt;
})

var userID;

describe('GET /api/practice/user', function() {

    it("should list user info", function (done) {
        var agent = request.agent(app);
        agent
            .get("/api/practice/user/me")
            .set({'Authorization': 'Bearer ' + practiceToken})
            .expect(200)
            .end(function (err, res) {
                expect(res.body.name).to.be.equal('Test User');
                done();
            });
    });

    it("should list user info", function (done) {
        var agent = request.agent(app);
        agent
            .get("/api/practice/user/me")
            .set({'Authorization': 'Bearer ' + dankysPracticeToken})
            .expect(200)
            .end(function (err, res) {
                expect(res.body.name).to.be.equal('Dankys');
                done();
            });
    });

    it("should return 401", function (done) {
        var agent = request.agent(app);
        agent
            .get("/api/practice/user/me")
            .set({'Authorization': 'Bearer ' + token})
            .expect(500)
            .end(function (err, res) {
                expect(res.error.status).to.be.equal(401);
                done();
            });
    });
});
describe('POST /api/practice/user', function() {
    it("should say user exists for this new user", function (done) {
        var agent = request.agent(app);
        agent
            .post("/api/practice/user")
            .send({
                provider: 'practice',
                role: 'user',
                name: 'Test User',
                email: 'test@test.com',
                password: 'test'
            })
            .set({'Authorization': 'Bearer ' + practiceToken})
            .expect(500)
            .end(function (err, res) {
                expect(res.error.status).to.be.equal(500);
                done();
            });
    });

    it("should say user needs a password for this new user", function (done) {
        var agent = request.agent(app);
        agent
            .post("/api/practice/user")
            .send({
                provider: 'practice',
                role: 'user',
                name: 'Test User',
                email: 'tes2t@test.com'
            })
            .set({'Authorization': 'Bearer ' + practiceToken})
            .expect(500)
            .end(function (err, res) {
                expect(res.error.status).to.be.equal(500);
                done();
            });
    });

    it("should return 401", function (done) {
        var agent = request.agent(app);
        agent
            .post("/api/practice/user")
            .send({
                provider: 'practice',
                role: 'user',
                name: 'Test User',
                email: 'tes2t@test.com',
                password: 'password'
            })
            .expect(401)
            .end(function (err, res) {
                expect(res.error.status).to.be.equal(401);
                done();
            });
    });

    it("should create a single user", function (done) {
        var agent = request.agent(app);
        agent
            .post("/api/practice/user")
            .send({
                provider: 'practice',
                role: 'user',
                name: 'Test User',
                email: 'tes2t@test.com',
                password: 'password'
            })
            .set({'Authorization': 'Bearer ' + practiceToken})
            .expect(200)
            .end(function (err, res) {
                practiceToken = res.body.token;
                expect(res.body.token).to.not.be.undefined;
                done();
            });
    });
});

describe('GET /api/practice/user', function() {
    it("should list users", function (done) {
        var agent = request.agent(app);
        agent
            .get("/api/practice/user")
            .set({'Authorization': 'Bearer ' + practiceToken})
            .expect(200)
            .end(function (err, res) {
                userID = res.body[0]._id;
                expect(res.body.length).to.be.equal(3);
                done();
            });
    });
});


describe('PUT /api/practice/user/password', function() {
    it("should not change a users password", function (done) {
        var agent = request.agent(app);
        agent
            .put("/api/practice/user/password")
            .send({oldPassword: "text", newPassword: "test2"})
            .set({'Authorization': 'Bearer ' + practiceToken})
            .expect(403)
            .end(function (err, res) {
                expect(res.error.status).to.be.equal(403);
                done();
            });
    });
});

describe('PUT /api/practice/user/password', function() {
    it("should change a users password", function (done) {
        var agent = request.agent(app);
        agent
            .put("/api/practice/user/password")
            .send({oldPassword: "password", newPassword: "test2"})
            .set({'Authorization': 'Bearer ' + practiceToken})
            .expect(200)
            .end(function (err, res) {
                done();
            });
    });

    it("should log rza's practice user in", function (done) {
        var user = {email: 'tes2t@test.com', password: 'test2'};
        request(app)
            .post("/auth/practice")
            .send(user)
            .expect(200)
            .end(function (err, res) {
                practiceToken = res.body.token;
                done();
            });
    });
});

