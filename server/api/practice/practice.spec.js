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
                expect(res.body.length).to.be.equal(2);
                done();
            });

    });
});