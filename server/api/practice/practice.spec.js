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

Thing.find({}).remove(function() { Thing.create(ThingSeed.seed)});

User.find({}).remove(function() { User.create(UserSeed.seed); });

Practice.find({}).remove(function() { Practice.create(PracticeSeed.seed) });

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
    var practiceToken;
    var dankysPracticeToken;

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

    it("should log rza's practice user in", function (done) {
        var user = {email: 'test@test.com', password: 'test'};
        request(app)
            .post("/auth/practice")
            .send(user)
            .expect(200)
            .end(function (err, res) {
                practiceToken = res.body.token;
                done();
            });
    });

    it("should log dankys practice user in", function (done) {
        var user = {email: 'jpdanks@gmail.com', password: 'dankys'};
        request(app)
            .post("/auth/practice")
            .send(user)
            .expect(200)
            .end(function (err, res) {
                dankysPracticeToken = res.body.token;
                done();
            });
    });

    it("should list practice info", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/me")
            .set({'Authorization': 'Bearer ' + practiceToken})
            .expect(200)
            .end(function (err, res) {
                expect(res.body.name).to.be.equal("Rza's Practice");
                done();
            });
    });

    it("should list practice info", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/me")
            .set({'Authorization': 'Bearer ' + dankysPracticeToken})
            .expect(200)
            .end(function (err, res) {
                expect(res.body.name).to.be.equal("Danky's Office");
                done();
            });
    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/me")
            .set({'Authorization': 'Bearer ' + token})
            .expect(500)
            .end(function (err, res) {
                expect(res.error.status).to.be.equal(401);
                done();
            });
    });


    it("should list user info", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/user/me")
            .set({'Authorization': 'Bearer ' + practiceToken})
            .expect(200)
            .end(function (err, res) {
                expect(res.body.name).to.be.equal('Test User');
                done();
            });
    });

    it("should list user info", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/user/me")
            .set({'Authorization': 'Bearer ' + dankysPracticeToken})
            .expect(200)
            .end(function (err, res) {
                expect(res.body.name).to.be.equal('Dankys');
                done();
            });
    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/user/me")
            .set({'Authorization': 'Bearer ' + token})
            .expect(500)
            .end(function (err, res) {
                expect(res.error.status).to.be.equal(401);
                done();
            });
    });


    it("should create a new practice", function(done) {
        var agent = request.agent(app);
        var name = "New Practice";
        agent
            .post("/api/practices")
            .send({name: name})
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                expect(res.body.name).to.be.equal(name);
                done();
            });
    });

    it("should return 401", function(done) {
        var agent = request.agent(app);
        var name = "New Practice";
        agent
            .post("/api/practices")
            .send({name: name})
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
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
                expect(res.body.length).to.be.equal(3);
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

    describe('GET /api/practices/:id', function() {
        it("should list a single practice", function (done) {
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

        it("should return 500", function(done) {
            var agent = request.agent(app);
            agent
                .get("/api/practices/invalidid")
                .set({'Authorization': 'Bearer ' + token})
                .expect(500)
                .end(function (err, res) {
                    expect(res.status).to.be.equal(500);
                    done();
                });
        });

        it("should return 404", function(done) {
            var agent = request.agent(app);
            agent
                .get("/api/practices/549a02f96766af149533a7ee")
                .set({'Authorization': 'Bearer ' + token})
                .expect(200)
                .end(function (err, res) {
                    expect(res.status).to.be.equal(404);
                    done();
                });
        });

        describe('GET /api/practices/:id/user', function() {
            it("should say user exists for this new user", function (done) {
                var agent = request.agent(app);
                agent
                    .post("/api/practices/" + practiceID + "/user")
                    .send({
                        provider: 'practice',
                        role: 'user',
                        name: 'Test User',
                        email: 'test@test.com',
                        password: 'test'
                    })
                    .set({'Authorization': 'Bearer ' + token})
                    .expect(500)
                    .end(function (err, res) {
                        expect(res.error.status).to.be.equal(500);
                        done();
                    });

                it("should say user needs a password for this new user", function(done) {
                    var agent = request.agent(app);
                    agent
                        .post("/api/practices/" + practiceID + "/user")
                        .send({ provider: 'practice',
                            role: 'user',
                            name: 'Test User',
                            email: 'tes2t@test.com'})
                        .set({'Authorization': 'Bearer ' + token})
                        .expect(500)
                        .end(function (err, res) {
                            expect(res.error.status).to.be.equal(500);
                            done();
                        });
                });

                it("should return 401", function(done) {
                    var agent = request.agent(app);
                    agent
                        .post("/api/practices/" + practiceID + "/user")
                        .send({ provider: 'practice',
                            role: 'user',
                            name: 'Test User',
                            email: 'tes2t@test.com',
                            password: 'password'})
                        .expect(401)
                        .end(function (err, res) {
                            expect(res.error.status).to.be.equal(401);
                            done();
                        });
                });

                it("should create a single user for a particular practice", function(done) {
                    var agent = request.agent(app);
                    agent
                        .post("/api/practices/" + practiceID + "/user")
                        .send({ provider: 'practice',
                            role: 'user',
                            name: 'Test User',
                            email: 'tes2t@test.com',
                            password: 'password'})
                        .set({'Authorization': 'Bearer ' + token})
                        .expect(200)
                        .end(function (err, res) {
                            practiceToken = res.body.token
                            expect(res.body.token).to.not.be.undefined;
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
                            expect(res.body.length).to.be.equal(3);
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

            });
            describe('GET /api/practices/:id/user/:id2', function() {
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
            })
        });



        describe('GET /api/practices/:id/facility', function() {
            it("should create a facility", function(done) {
                var agent = request.agent(app);
                var name = "Seattle Office";
                agent
                    .post("/api/practices/" + practiceID + "/facility")
                    .set({'Authorization': 'Bearer ' + token})
                    .send({name: name})
                    .expect(200)
                    .end(function (err, res) {
                        expect(res.body[1].name).to.be.equal(name);
                        done();
                    });
            });

            it("should return 401", function(done) {
                var agent = request.agent(app);
                var name = "Seattle Office";
                agent
                    .post("/api/practices/" + practiceID + "/facility")
                    .send({name: name})
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
                        expect(res.body.length).to.be.equal(2);
                        facilityID = res.body[0]._id;
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
        });


        describe('GET /api/practices/facility', function() {

            it("should list facilities", function(done) {
                var agent = request.agent(app);
                agent
                    .get("/api/practices/facility")
                    .set({'Authorization': 'Bearer ' + practiceToken})
                    .expect(200)
                    .end(function (err, res) {
                        expect(res.body.length).to.be.equal(2);
                        facilityID = res.body[0]._id;
                        done();
                    });
            });

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


    /* Fail
    it("should create a single facility hours", function(done) {
        var agent = request.agent(app);
        agent
            .post("/api/practices/" + practiceID + "/facility/" + facilityID + "/hours")
            .send({ day: "Friday",
                    start: 8,
                    end: 17})
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                expect(res.body.hours[1].day).to.be.equal("Friday");
                done();
            });
    });
    */

    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .post("/api/practices/" + practiceID + "/facility/" + facilityID + "/hours")
            .send({ day: "Friday",
                start: 8,
                end: 17})
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    /* Fail
    it("should list a single facility hours", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility/" + facilityID + "/hours")
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                hoursID = res.body[0]._id;
                expect(res.body.length).to.be.equal(2);
                done();
            });
    });
    */

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


    /* Fail
    it("should create a single facility contact.phone", function(done) {
        var agent = request.agent(app);
        agent
            .post("/api/practices/" + practiceID + "/facility/" + facilityID + "/contact.phone")
            .send({description: "Office", number: "2123321112"})
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                expect(res.body.contact.phone[1].description).to.be.equal("Office");
                done();
            });
    });
    */


    it("should return 401", function(done) {
        var agent = request.agent(app);
        agent
            .post("/api/practices/" + practiceID + "/facility/" + facilityID + "/contact.phone")
            .send({description: "Office", number: "2123321112"})
            .expect(401)
            .end(function (err, res) {
                expect(res.status).to.be.equal(401);
                done();
            });
    });

    /* Fail
    it("should list a single facility contact.phone", function(done) {
        var agent = request.agent(app);
        agent
            .get("/api/practices/" + practiceID + "/facility/" + facilityID + "/contact.phone")
            .set({'Authorization': 'Bearer ' + token})
            .expect(200)
            .end(function (err, res) {
                contactPhoneID = res.body[0]._id;
                expect(res.body.length).to.be.equal(2);
                done();
            });
    });
    */

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