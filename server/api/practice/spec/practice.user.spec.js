'use strict';
var reqlib = require('app-root-path').require;
var dataseed = reqlib('/server/test/dataseed');
var datareset = reqlib('/server/test/datareset');
var app = reqlib('/server/app');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var request = require("supertest-as-promised");
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
chai.use(chaiAsPromised);
mockgoose(mongoose);
mockgoose.reset();
var facilityID;
var contactPhoneID;
var token, practiceToken, dankysPracticeToken;
var userID;
describe('/api/practice/user', function() {
    before(function (done) {
        dataseed.seed().then(function (tokens) {
            token = tokens[0].body.token;
            practiceToken = tokens[1].body.token;
            dankysPracticeToken = tokens[2].body.token;
            done();
        });
    });
    after(function (done) {
        datareset.reset(done);
    });

    describe('GET /api/practice/user', function () {

        it("should list user info", function (done) {
            var agent = request.agent(app);
            agent
                .get("/api/practice/user/me")
                .set({'Authorization': 'Bearer ' + practiceToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.name.first).to.be.equal('Test');
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
                    expect(res.body.name.first).to.be.equal('Dankys');
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
    describe('POST /api/practice/user', function () {

        var existing_user = {
            provider: 'practice',
            role: 'user',
            name: { first: 'Test'},
            contact: {
                address: {
                    number: 1022,
                    direction: "",
                    street: "Trenton Pl",
                    zip5: 19801,
                    country: "United States"
                },
                phone: [{description: "Mobile", number: "2679743526"}],
                email: "test@test.com",
                canSMS: 1,
                canVoice: 1,
                canEmail: 1,
                preferred: 1
            },
            password: 'test'
        };

        var new_user_no_pass = {
            provider: 'practice',
            role: 'user',
            name: { first: 'Test'},
            contact: {
                address: {
                    number: 1022,
                    direction: "",
                    street: "Trenton Pl",
                    zip5: 19801,
                    country: "United States"
                },
                phone: [{description: "Mobile", number: "2679743526"}],
                email: "tes2t@test.com",
                canSMS: 1,
                canVoice: 1,
                canEmail: 1,
                preferred: 1
            }
        }

        var new_user = {
            provider: 'practice',
            role: 'user',
            name: { first: 'Test'},
            contact: {
                address: {
                    number: 1022,
                    direction: "",
                    street: "Trenton Pl",
                    zip5: 19801,
                    country: "United States"
                },
                phone: [{description: "Mobile", number: "2679743526"}],
                email: "tes2t@test.com",
                canSMS: 1,
                canVoice: 1,
                canEmail: 1,
                preferred: 1
            },
            password: 'password'
        }

        it("should say user exists for this new user", function (done) {
            var agent = request.agent(app);
            agent
                .post("/api/practice/user")
                .send(existing_user)
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
                .send(new_user_no_pass)
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
                .send(new_user)
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
                .send(new_user)
                .set({'Authorization': 'Bearer ' + practiceToken})
                .expect(200)
                .end(function (err, res) {
                    practiceToken = res.body.token;
                    expect(res.body.token).to.not.be.undefined;
                    done();
                });
        });
    });

    describe('GET /api/practice/user', function () {
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


    describe('PUT /api/practice/user/password', function () {
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

    describe('PUT /api/practice/user/password', function () {
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
});
