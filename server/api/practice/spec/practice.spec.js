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

    it("should list practice info", function(done) {
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

    it("should list practice info", function(done) {
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

    it("should return 401", function(done) {
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


    it("should list user info", function(done) {
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

    it("should list user info", function(done) {
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

    it("should return 401", function(done) {
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
