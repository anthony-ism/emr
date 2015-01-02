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
describe('/api/practice', function() {
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

    var facilityID;

    describe('GET /api/practice/me', function() {
        it("should list practice info", function (done) {

            var agent = request.agent(app);
            agent
                .get("/api/practice/me")
                .set({'Authorization': 'Bearer ' + practiceToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.name).to.be.equal("Rza's Practice");
                    done();
                });
        });


        it("should list practice info", function (done) {
            var agent = request.agent(app);
            agent
                .get("/api/practice/me")
                .set({'Authorization': 'Bearer ' + dankysPracticeToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.name).to.be.equal("Danky's Office");
                    done();
                });
        });

        it("should return 401", function (done) {
            var agent = request.agent(app);
            agent
                .get("/api/practice/me")
                .set({'Authorization': 'Bearer ' + token})
                .expect(500)
                .end(function (err, res) {
                    expect(res.error.status).to.be.equal(401);
                    done();
                });
        });


    });

    describe('GET /api/practice/user/me', function() {


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

    describe('GET /api/practice/facility', function() {
        it("should list facilities", function(done) {
            var agent = request.agent(app);
            agent
                .get("/api/practice/facility")
                .set({'Authorization': 'Bearer ' + practiceToken})
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.length).to.be.equal(1);
                    facilityID = res.body[0]._id;
                    done();
                });
        });
    });
});
