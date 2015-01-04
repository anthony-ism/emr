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


var token, practiceToken, dankysPracticeToken;
describe('/admin/practice', function() {
    before(function(done) {
        dataseed.seed().then(function(tokens) {
            token = tokens[0].body.token;
            practiceToken = tokens[1].body.token;
            dankysPracticeToken = tokens[2].body.token;
            done();
        });
    });
    after(function(done) {
        datareset.reset(done);
    });

    var practiceID, userID, facilityID, hoursID, contactPhoneID;
    describe('GET /admin/practice', function() {
        it("should list all practices", function (done) {
            var agent = request.agent(app);
            agent
                .get("/admin/practice")
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    practiceID = res.body[0]._id;
                    expect(res.body.length).to.be.equal(2);
                    done();
                });
        });
    });


    describe('POST /admin/practice/:id/user', function () {


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
                .post("/admin/practice/" + practiceID + "/user")
                .send(existing_user)
                .set({'Authorization': 'Bearer ' + token})
                .expect(500)
                .end(function (err, res) {
                    expect(res.error.status).to.be.equal(500);
                    done();
                });
        });



        it("should say user needs a password for this new user", function (done) {
            var agent = request.agent(app);
            agent
                .post("/admin/practice/" + practiceID + "/user")
                .send(new_user_no_pass)
                .set({'Authorization': 'Bearer ' + token})
                .expect(500)
                .end(function (err, res) {
                    expect(res.error.status).to.be.equal(500);
                    done();
                });
        });


        it("should create a single user", function (done) {
            var agent = request.agent(app);
            agent
                .post("/admin/practice/" + practiceID + "/user")
                .send(new_user)
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    practiceToken = res.body.token;
                    expect(res.body.token).to.not.be.undefined;
                    done();
                });
        });

    });


    describe('GET /admin/practice/:id/user', function () {
        it("should list users for a particular practice", function (done) {
            var agent = request.agent(app);
            agent
                .get("/admin/practice/" + practiceID + "/user")
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    userID = res.body[0]._id;
                    expect(res.body.length).to.be.equal(3);
                    done();
                });
        });
    });


    describe('PUT /admin/practice/:id/user/:id2/password', function () {
        it("should not change a users password", function (done) {
            var agent = request.agent(app);
            agent
                .put("/admin/practice/" + practiceID + "/user/" + userID + "/password")
                .send({oldPassword: "text", newPassword: "test2"})
                .set({'Authorization': 'Bearer ' + token})
                .expect(403)
                .end(function (err, res) {
                    expect(res.error.status).to.be.equal(403);
                    done();
                });
        });
    });


    describe('PUT /admin/practice/:id/user/:id2/password', function () {
        it("should change a users password", function (done) {
            var agent = request.agent(app);
            agent
                .put("/api/practice/" + practiceID + "/user/" + userID + "/password")
                .send({oldPassword: "test", newPassword: "test2"})
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    done();
                });
        });


        it("should log rza's practice user in", function (done) {
            var user = {email: 'test@test.com', password: 'test2'};
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


    describe('GET /admin/practice/:id/user', function() {
        it("should list all users in a particular practice", function (done) {
            var agent = request.agent(app);
            agent
                .get("/admin/practice/" + practiceID + "/user")
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    userID = res.body[0]._id;
                    expect(res.body.length).to.be.equal(3);
                    done();
                });
        });
    });

    describe('GET /admin/practice/:id/user/:id2', function() {
        it("should list particular user from a particular practice", function (done) {
            var agent = request.agent(app);
            agent
                .get("/admin/practice/" + practiceID + "/user/" + userID)
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body._id).to.be.equal(userID);
                    done();
                });
        });
    });

});



