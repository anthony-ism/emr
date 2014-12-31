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



describe('/api/practice/facility', function() {
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


    var facilityID;
    describe('POST /api/practice/facility', function() {
        it("should create a new facility", function (done) {
            var agent = request.agent(app);
            var name = "Down Town Office II";
            agent
                .post("/api/practice/facility")
                .set({'Authorization': 'Bearer ' + practiceToken})
                .send({name: name})
                .expect(200)
                .end(function (err, res) {
                    facilityID = res.body._id;
                    expect(res.body.name).to.be.equal(name);
                    done();
                });
        });

        it("should return 401", function (done) {
            var agent = request.agent(app);
            var name = "Down Town Office II";
            agent
                .post("/api/practice/facility")
                .set({'Authorization': 'Bearer ' + token})
                .send({name: name})
                .expect(401)
                .end(function (err, res) {
                    expect(res.error.status).to.be.equal(401);
                    done();
                });
        });
    });

    describe('PUT /api/practice/facility', function() {
        it("should update previously added facility", function (done) {
            var agent = request.agent(app);
            var name = "Down Town Office III";
            agent
                .put("/api/practice/facility/" + facilityID)
                .set({'Authorization': 'Bearer ' + practiceToken})
                .send({name: name})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.name).to.be.equal(name);
                    done();
                });
        });

        it("return 401", function (done) {
            var agent = request.agent(app);
            var name = "Down Town Office III";
            agent
                .put("/api/practice/facility/" + facilityID)
                .set({'Authorization': 'Bearer ' + token})
                .send({name: name})
                .expect(401)
                .end(function (err, res) {
                    expect(res.error.status).to.be.equal(401);
                    done();
                });
        });
    });



    describe('GET /api/practice/facility', function() {
        it("should list rza's facility", function(done) {
            var agent = request.agent(app);
            agent
                .get("/api/practice/facility")
                .set({'Authorization': 'Bearer ' + practiceToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body[0].name).to.be.equal("Down town office");
                    expect(res.body[1].name).to.be.equal("Down Town Office III");
                    facilityID = res.body[0]._id;
                    done();
                });
        });

        it("should list danky's facility", function(done) {
            var agent = request.agent(app);
            agent
                .get("/api/practice/facility")
                .set({'Authorization': 'Bearer ' + dankysPracticeToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body[0].name).to.be.equal("Seattle Office");
                    done();
                });
        });

        it("should return 401", function(done) {
            var agent = request.agent(app);
            agent
                .get("/api/practice/facility")
                .set({'Authorization': 'Bearer ' + token})
                .expect(500)
                .end(function (err, res) {
                    expect(res.error.status).to.be.equal(401);
                    done();
                });
        });
    });

    describe('DELETE /api/practice/facility', function() {
        it("should remove facility", function (done) {
            var agent = request.agent(app);
            agent
                .delete("/api/practice/facility/" + facilityID)
                .set({'Authorization': 'Bearer ' + practiceToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.length).to.be.equal(1);
                    done();
                });
        });
    });
});
