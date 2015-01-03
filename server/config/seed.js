/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var ThingSeed = require('./seeds/thing.seed')
var User = require('../admin/user/user.model');
var UserSeed = require('./seeds/user.seed');
var Practice = require('../api/practice/practice.model');
var PracticeSeed = require('./seeds/practice.seed');

return;
Thing.find({}).remove(function() {
  Thing.create(ThingSeed.Thing)});

User.find({}).remove(function() {
  User.create(UserSeed.User, function() {
    }
  );
});

Practice.find({}).remove(function() {
    Practice.create(PracticeSeed.Practice)
});








