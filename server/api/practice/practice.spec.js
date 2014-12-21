'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
var reqlib = require('app-root-path').require;

var chai = require('chai');
var expect = chai.expect;


mockgoose(mongoose);
mockgoose.reset();

/** Seeding Database needs to be included and evaled often **/
var Thing = reqlib('/server/api/thing/thing.model');
var ThingSeed = reqlib('/server/config/seeds/thing.seed');

var User = reqlib('/server/api/user/user.model');
var UserSeed = reqlib('/server/config/seeds/user.seed');

var Practice = reqlib('/server/api/practice/practice.model');
var PracticeSeed = reqlib('/server/config/seeds/practice.seed');

Thing.find({}).remove(function() {
    Thing.create(ThingSeed.seed)});

User.find({}).remove(function() {
    User.create(UserSeed.seed, function() {
            //console.log('finished populating users');
        }
    );
});

Practice.find({}).remove(function() {
    Practice.create(PracticeSeed.seed, function(err, rizzo, danks) {
        //console.log(err);
        //console.log(rizzo);
        //console.log(danks);
    })
});

/*
var fs = require("fs");
var vm = require('vm');
console.log(__dirname);
var filename = __dirname + "/../../config/seed.js";
eval(fs.readFileSync(filename)+'');
*/


describe('GET /api/practices', function() {
    var token;
    var practiceID;
    var userID;
    var facilityID;
    var hoursID;
    var contactPhoneID;

    it("should log an admin in", function (done) {
        var user = {email: 'rizzo0917@gmail.com', password: 'PT4ExXEZ'};

        request(app)
            .post("/auth/local")
            .send(user)
            .expect(200)
            .end(function (err, res) {
                token = res.body.token;
                done();
            });
    });

    it("should list all practices", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices")
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {

                practiceID = res.body[0]._id;
                expect(res.body.length).to.be.equal(2);
                done();
            });

    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices")
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    it("should list a single practice", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID)
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {

                expect(practiceID).to.be.equal(res.body._id);
                done();
            });
    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID)
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });


    it("should list users", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/user")
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                userID = res.body[0]._id;
                expect(res.body.length).to.be.equal(2);
                done();
            });
    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/user")
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    it("should list a single user", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/user/" + userID)
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                expect(userID).to.be.equal(res.body._id);
                done();
            });
    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/user/" + userID)
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });



    it("should list facilities", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility")
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                facilityID = res.body[0]._id;
                expect(res.body.length).to.be.equal(1);
                done();
            });
    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility")
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });


    it("should list a single facility", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility/" + facilityID)
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                expect(facilityID).to.be.equal(res.body._id);
                done();
            });
    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility/" + facilityID)
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });



    it("should list a single facility hours", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility/" + facilityID + "/hours")
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                hoursID = res.body[0]._id;
                expect(res.body.length).to.be.equal(1);
                done();
            });
    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility/" + facilityID + "/hours")
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });


    it("should list a single facility single hour", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility/" + facilityID + "/hours/" + hoursID)
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                expect(hoursID).to.be.equal(res.body._id);
                done();
            });
    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility/" + facilityID + "/hours/" + hoursID)
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    it("should list a single facility contact.phone", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility/" + facilityID + "/contact.phone")
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                contactPhoneID = res.body[0]._id;
                expect(res.body.length).to.be.equal(1);
                done();
            });
    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility/" + facilityID + "/contact.phone")
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    it("should list a single facility single contact.phone", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility/" + facilityID + "/contact.phone/" + contactPhoneID)
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                expect(contactPhoneID).to.be.equal(res.body._id);
                done();
            });
    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility/" + facilityID + "/contact.phone/" + contactPhoneID)
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });


});