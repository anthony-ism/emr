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
describe('/api/practice/facility/contact.phone', function() {
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

    describe('GET /api/practice/facility', function () {
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
    });

    describe('POST /api/practice/facility/:id/contact.phone', function () {
        it("should add rza's Down town office hour", function (done) {
            var description = "Office Backup";
            var agent = request.agent(app);
            agent
                .post("/api/practice/facility/" + facilityID + "/contact.phone")
                .set({'Authorization': 'Bearer ' + practiceToken})
                .send({"description": description})
                .expect(200)
                .end(function (err, res) {
                    contactPhoneID = res.body._id;
                    expect(res.body.description).to.be.equal(description);
                    done();
                });
        });
    });

    describe('PUT /api/practice/facility/:id/contact.phone/:id2', function () {
        it("should update rza's Down town office hour", function (done) {
            var description = "Office Backup II";
            var agent = request.agent(app);
            agent
                .put("/api/practice/facility/" + facilityID + "/contact.phone/" + contactPhoneID)
                .set({'Authorization': 'Bearer ' + practiceToken})
                .send({"description": description})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.description).to.be.equal(description);
                    done();
                });
        });
    });

    describe('DELETE /api/practice/facility/:id/contact.phone/:id2', function () {
        it("should delete rza's Down town office hour", function (done) {
            var description = "Office Backup II";
            var agent = request.agent(app);
            agent
                .delete("/api/practice/facility/" + facilityID + "/contact.phone/" + contactPhoneID)
                .set({'Authorization': 'Bearer ' + practiceToken})
                .send({"description": description})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.length).to.be.equal(1);
                    done();
                });
        });
    });

    describe('GET /api/practice/facility/:id/contact.phone', function () {
        it("should list rza's Down town office contact.phone", function (done) {
            var agent = request.agent(app);
            agent
                .get("/api/practice/facility/" + facilityID + "/contact.phone")
                .set({'Authorization': 'Bearer ' + practiceToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body[0].description).to.be.equal("Office");
                    expect(res.body.length).to.be.equal(1);
                    contactPhoneID = res.body[0]._id;
                    done();
                });
        });

        it("should list rza's Down town office contact.phone", function (done) {
            var agent = request.agent(app);
            agent
                .get("/api/practice/facility/" + facilityID + "/contact.phone/" + contactPhoneID)
                .set({'Authorization': 'Bearer ' + practiceToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.description).to.be.equal("Office");
                    done();
                });
        });
    });
});
