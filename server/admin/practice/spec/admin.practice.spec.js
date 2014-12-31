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

    describe('GET /admin/practice/:id', function() {
        it("should list a particular practice", function (done) {
            var agent = request.agent(app);
            agent
                .get("/admin/practice/" + practiceID)
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body._id).to.be.equal(practiceID);
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
                    expect(res.body.length).to.be.equal(2);
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


    describe('GET /admin/practice/:id/facility', function() {
        it("should list all facilities in a particular practice", function (done) {
            var agent = request.agent(app);
            agent
                .get("/admin/practice/" + practiceID + "/facility")
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    facilityID = res.body[0]._id;
                    expect(res.body.length).to.be.equal(1);
                    done();
                });
        });
    });

    describe('GET /admin/practice/:id/facility/:id2', function() {
        it("should list particular facility from a particular practice", function (done) {
            var agent = request.agent(app);
            agent
                .get("/admin/practice/" + practiceID + "/facility/" + facilityID)
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body._id).to.be.equal(facilityID);
                    done();
                });
        });
    });

    describe('GET /admin/practice/:id/facility/:id2/hours', function() {
        it("should list all hours from a particular facility from a particular practice", function (done) {
            var agent = request.agent(app);
            agent
                .get("/admin/practice/" + practiceID + "/facility/" + facilityID + "/hours")
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    hoursID = res.body[0]._id;
                    expect(res.body.length).to.be.equal(1);
                    done();
                });
        });
    });

    describe('GET /admin/practice/:id/facility/:id2/hours/:id3', function() {
        it("should list a particular hour from particular facility from a particular practice", function (done) {
            var agent = request.agent(app);
            agent
                .get("/admin/practice/" + practiceID + "/facility/" + facilityID + "/hours/" + hoursID)
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body._id).to.be.equal(hoursID);
                    done();
                });
        });
    });


    describe('GET /admin/practice/:id/facility/:id2/contact.phone', function() {
        it("should list all contact.phone from a particular facility from a particular practice", function (done) {
            var agent = request.agent(app);
            agent
                .get("/admin/practice/" + practiceID + "/facility/" + facilityID + "/contact.phone")
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    contactPhoneID = res.body[0]._id;
                    expect(res.body.length).to.be.equal(1);
                    done();
                });
        });
    });

    describe('GET /admin/practice/:id/facility/:id2/contact.phone/:id3', function() {
        it("should list a particular contact.phone from particular facility from a particular practice", function (done) {
            var agent = request.agent(app);
            agent
                .get("/admin/practice/" + practiceID + "/facility/" + facilityID + "/contact.phone/" + contactPhoneID)
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body._id).to.be.equal(contactPhoneID);
                    done();
                });
        });
    });
});



