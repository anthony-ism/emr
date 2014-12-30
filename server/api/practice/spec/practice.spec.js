'use strict';
var reqlib = require('app-root-path').require;

var dataseed = reqlib('/server/test/dataseed');
var datareset = reqlib('/server/test/datareset');
var logintoken = reqlib('/server/test/logintoken');

var app = reqlib('/server/app');

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
var expect = chai.expect;

var token;
var practiceToken;
var dankysPracticeToken;

var UserSeed = reqlib('/server/config/seeds/user.seed');
var PracticeSeed = reqlib('/server/config/seeds/practice.seed');


var request = require("supertest-as-promised");

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

var Q = require('Q');

mockgoose(mongoose);
mockgoose.reset();

var loadMe = function() {
    var deferred = Q.defer();

    return deferred.promise;
}

var getToken = function() {
    var user = {email: 'rizzo0917@gmail.com', password: 'PT4ExXEZ'};
    return request(app)
        .post("/auth/local")
        .send(user)
        .expect(200);
}

var getPracticeToken = function ()
{
    var user = {email: 'test@test.com', password: 'test'};
    return request(app)
        .post("/auth/practice")
        .send(user)
        .expect(200);
}

var getDankysPracticeToken = function()
{
    var user = {email: 'jpdanks@gmail.com', password: 'dankys'};
    return request(app)
        .post("/auth/practice")
        .send(user)
        .expect(200);
}

describe('/api/practice', function() {

    before(function(done) {
        mockgoose(mongoose);
        /** Seeding Database needs to be included and evaled often **/
        var Thing = reqlib('/server/api/thing/thing.model');
        var ThingSeed = reqlib('/server/config/seeds/thing.seed');

        var User = reqlib('/server/api/user/user.model');
        var UserSeed = reqlib('/server/config/seeds/user.seed');

        var Practice = reqlib('/server/api/practice/practice.model');
        var PracticeSeed = reqlib('/server/config/seeds/practice.seed');

        User.find({}).remove().exec().then(function() {
            return User.create(UserSeed.User);
        }).then(function() {
            return Practice.find({}).remove().exec();
        }).then(function() {
            return Practice.create(PracticeSeed.Practice);
        }).then(function() {
            return getToken();
        }).then(function (res) {
            token = res.body.token;
            return getPracticeToken();
        }).then(function(res) {
            practiceToken = res.body.token;
            return getDankysPracticeToken();
        }).then(function(res) {
            dankysPracticeToken = res.body.token;
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
