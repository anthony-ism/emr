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
});



