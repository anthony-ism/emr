/**
 * Created by anthony on 12/29/14.
 */
'use strict';
var reqlib = require('app-root-path').require;
var should = require('should');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');


exports.reset = function(done) {

    mockgoose(mongoose);
    var Thing = reqlib('/server/api/thing/thing.model');
    var User = reqlib('/server/api/user/user.model');
    var Practice = reqlib('/server/api/practice/practice.model');

    User.remove().exec();
    Thing.remove().exec();
    Practice.remove().exec();


    if (done !== undefined) {
        done();
    }
}