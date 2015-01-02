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


    describe("POST /admin/practice/:id/facility", function() {
        it("should create a new facility", function (done) {
            var agent = request.agent(app);
            var name = "Down Town Office II";
            agent
                .post("/admin/practice/" +practiceID + "/facility")
                .set({'Authorization': 'Bearer ' + token})
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
                .post("/admin/practice/" + practiceID + "/facility")
                .set({'Authorization': 'Bearer ' + practiceToken})
                .send({name: name})
                .expect(401)
                .end(function (err, res) {
                    expect(res.error.status).to.be.equal(401);
                    done();
                });
        });

    });

    describe('PUT /admin/practice/:id/facility', function() {

        var name = "Down Town Office III";
        it("should update previously added facility", function (done) {
            var agent = request.agent(app);
            agent
                .put("/admin/practice/" + practiceID + "/facility/" + facilityID)
                .set({'Authorization': 'Bearer ' + token})
                .send({name: name})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.name).to.be.equal(name);
                    done();
                });

        });


        it("return 401", function (done) {
            var agent = request.agent(app);
            agent
                .put("/admin/practice/" + practiceID +  "/facility/" + facilityID)
                .set({'Authorization': 'Bearer ' + practiceToken})
                .send({name: name})
                .expect(401)
                .end(function (err, res) {
                    expect(res.error.status).to.be.equal(401);
                    done();
                });
        });

    });



    describe('GET /admin/practice/:id/facility', function() {

        it("should list rza's facility", function(done) {
            var agent = request.agent(app);
            agent
                .get("/admin/practice/" + practiceID + "/facility")
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body[0].name).to.be.equal("Down town office");
                    expect(res.body[1].name).to.be.equal("Down Town Office III");
                    facilityID = res.body[0]._id;
                    done();
                });
        });
    });

    describe("DELETE /admin/practice/" + practiceID + "/facility", function() {
        it("should remove facility", function (done) {
            var agent = request.agent(app);
            agent
                .delete("/admin/practice/" + practiceID + "/facility/" + facilityID)
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.length).to.be.equal(1);
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




});



