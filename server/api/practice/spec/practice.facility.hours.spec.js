'use strict';
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
describe('GET /api/practice/facility/hours', function() {
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
    var hoursID;

    describe('GET /api/practice/facility', function() {
        it("should list rza's facility", function (done) {
            var agent = request.agent(app);
            agent
                .get("/api/practice/facility")
                .set({'Authorization': 'Bearer ' + practiceToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body[0].name).to.be.equal("Down town office");
                    facilityID = res.body[0]._id;
                    done();
                });
        });
    })

    describe('POST /api/practice/facility/:id/hours', function() {
        it("should add rza's Down town office hour", function(done) {
            var day  = "Tuesday";
            var agent = request.agent(app);
            agent
                .post("/api/practice/facility/" + facilityID + "/hours")
                .set({'Authorization': 'Bearer ' + practiceToken})
                .send({"day": day})
                .expect(200)
                .end(function (err, res) {
                    hoursID = res.body._id;
                    expect(res.body.day).to.be.equal(day);
                    done();
                });
        });
    });

    describe('PUT /api/practice/facility/:id/hours/:id2', function() {
        it("should update rza's Down town office hour", function(done) {
            var day  = "Wednesday";
            var agent = request.agent(app);
            agent
                .put("/api/practice/facility/" + facilityID + "/hours/" + hoursID)
                .set({'Authorization': 'Bearer ' + practiceToken})
                .send({"day": day})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.day).to.be.equal(day);
                    done();
                });
        });
    });

    describe('GET /api/practice/facility/:id/hours', function() {
        it("should list rza's Down town office hours", function(done) {
            var agent = request.agent(app);
            agent
                .get("/api/practice/facility/" + facilityID + "/hours")
                .set({'Authorization': 'Bearer ' + practiceToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.length).to.be.equal(2);
                    expect(res.body[0].day).to.be.equal("Monday");
                    hoursID = res.body[0]._id;
                    done();
                });
        });

        it("should list rza's Down town office hour", function(done) {
            var agent = request.agent(app);
            agent
                .get("/api/practice/facility/" + facilityID + "/hours/" + hoursID)
                .set({'Authorization': 'Bearer ' + practiceToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.day).to.be.equal("Monday");
                    done();
                });
        });
    });

    describe('DELETE /api/practice/facility/:id/hours/:id2', function() {
        it("should remove facility", function (done) {
            var agent = request.agent(app);
            agent
                .delete("/api/practice/facility/" + facilityID + "/hours/" + hoursID)
                .set({'Authorization': 'Bearer ' + practiceToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.length).to.be.equal(1);
                    done();
                });
        });
    });
});
