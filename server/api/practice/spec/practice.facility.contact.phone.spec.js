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
    });

    describe('POST /api/practice/facility/:id/contact.phone', function() {
        it("should add rza's Down town office hour", function(done) {
            var description  = "Office Backup";
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

    describe('PUT /api/practice/facility/:id/contact.phone/:id2', function() {
        it("should update rza's Down town office hour", function(done) {
            var description  = "Office Backup II";
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

    describe('DELETE /api/practice/facility/:id/contact.phone/:id2', function() {
        it("should delete rza's Down town office hour", function(done) {
            var description  = "Office Backup II";
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

    describe('GET /api/practice/facility/:id/contact.phone', function() {
        it("should list rza's Down town office contact.phone", function(done) {
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

        it("should list rza's Down town office contact.phone", function(done) {
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
