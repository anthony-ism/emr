/**
 * Created by anthony on 12/29/14.
 */
'use strict';
var reqlib = require('app-root-path').require;
var should = require('should');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
var Q = require('Q');
var Promise = require("native-promise-only");
var request = require("supertest-as-promised");
var app = reqlib('/server/app');


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

exports.seed = function() {
    var token, practiceToken, dankysPracticeToken;
    var promise = new Promise(function(resolve, reject) {
        mockgoose(mongoose);
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
            var tokens = [token, practiceToken, dankysPracticeToken];
            resolve(tokens);
        });
    });
    return promise;



}