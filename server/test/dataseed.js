/**
 * Created by anthony on 12/29/14.
 */
'use strict';
exports.seed = function() {

    console.log("##### Runnign #####");
    var reqlib = require('app-root-path').require;
    var should = require('should');
    var mongoose = require('mongoose');
    var mockgoose = require('mockgoose');

    mockgoose(mongoose);
    mockgoose.reset();

    /** Seeding Database needs to be included and evaled often **/
    var Thing = reqlib('/server/api/thing/thing.model');
    var ThingSeed = reqlib('/server/config/seeds/thing.seed');

    var User = reqlib('/server/api/user/user.model');
    var UserSeed = reqlib('/server/config/seeds/user.seed');

    var Practice = reqlib('/server/api/practice/practice.model');
    var PracticeSeed = reqlib('/server/config/seeds/practice.seed');

    Thing.find({}).remove(function () {
        Thing.create(ThingSeed.seed)
    });

    User.find({}).remove(function () {
        User.create(UserSeed.seed);
    });

    Practice.find({}).remove(function () {
        Practice.create(PracticeSeed.seed)
    });
}