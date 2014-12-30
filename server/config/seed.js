/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

return;
var Thing = require('../api/thing/thing.model');
var ThingSeed = require('./seeds/thing.seed')
var User = require('../api/user/user.model');
var UserSeed = require('./seeds/user.seed');
var Practice = require('../api/practice/practice.model');
var PracticeSeed = require('./seeds/practice.seed');

Thing.find({}).remove(function() {
  Thing.create(ThingSeed.seed)});

User.find({}).remove(function() {
  User.create(UserSeed.seed, function() {
    }
  );
});

Practice.find({}).remove(function() {
    Practice.create(PracticeSeed.seed)
});








