'use strict';
var reqlib = require('app-root-path').require;
var dataseed = reqlib('/server/test/dataseed');
var app = reqlib('/server/app');
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;
dataseed.seed();

describe('GET /api/practice', function() {
    /* These Variables need to be populated often */
    var token;
    var practiceToken;
    var dankysPracticeToken;

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
