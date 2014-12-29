'use strict';

var should = require('should');
var app = require('../../../app');
var request = require('supertest');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
var reqlib = require('app-root-path').require;

var chai = require('chai');
var expect = chai.expect;


mockgoose(mongoose);
mockgoose.reset();

/** Seeding Database needs to be included and evaled often **/
var Thing = reqlib('/server/api/thing/thing.model');
var ThingSeed = reqlib('/server/config/seeds/thing.seed');

var User = reqlib('/server/api/user/user.model');
var UserSeed = reqlib('/server/config/seeds/user.seed');

var Practice = reqlib('/server/api/practice/practice.model');
var PracticeSeed = reqlib('/server/config/seeds/practice.seed');

Thing.find({}).remove(function() { Thing.create(ThingSeed.seed)});

User.find({}).remove(function() { User.create(UserSeed.seed); });

Practice.find({}).remove(function() { Practice.create(PracticeSeed.seed) });

/*
var fs = require("fs");
var vm = require('vm');
console.log(__dirname);
var filename = __dirname + "/../../config/seed.js";
eval(fs.readFileSync(filename)+'');
*/

var token;
var practiceToken;
var dankysPracticeToken;

var practiceID;
var userID;
var facilityID;
var hoursID;
var contactPhoneID;

describe('GET /api/practice', function() {
    /* These Variables need to be populated often */


    it("should log an admin in", function (done) {
        var user = {email: 'rizzo0917@gmail.com', password: 'PT4ExXEZ'};

        request(app)
            .post("/auth/local")
            .send(user)
            .expect(200)
            .end(function (err, res) {
                token = res.body.token;
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
                done();
            });
    });


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


describe('PUT /api/practice/user/:id/password', function() {
    it("should change a users password", function (done) {
        var agent = request.agent(app);
        agent
            .put("/api/practice/user/" + userID + "/password")
            .send({oldPassword: "text", newPassword: "test2"})
            .set({'Authorization': 'Bearer ' + practiceToken})
            .expect(200)
            .end(function (err, res) {
                console.log(res);
                done();
            });
    });
});

/*
describe('PUT /api/practice/user/:id/password', function() {
    it("should fail to change a users password", function (done) {
        var agent = request.agent(app);
        agent
            .put("/api/practice/user/" + userID + "/password")
            .send({oldPassword: "text", newPassword: "test2"})
            .set({'Authorization': 'Bearer ' + practiceToken})
            .expect(200)
            .end(function (err, res) {
                console.log(res);
                done();
            });
    });
});
    */