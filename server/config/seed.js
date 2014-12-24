/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var ThingSeed = require('./seeds/thing.seed')
var User = require('../api/user/user.model');
var UserSeed = require('./seeds/user.seed');
var Practice = require('../api/practice/practice.model');
var PracticeSeed = require('./seeds/practice.seed');

return;

Thing.find({}).remove(function() {
  Thing.create(ThingSeed.seed)});

User.find({}).remove(function() {
  User.create(UserSeed.seed, function() {
      console.log('finished populating users');
    }
  );
});

Practice.find({}).remove(function() {
    Practice.create(PracticeSeed.seed, function(err, rizzo, danks) {
        console.log(err);
        console.log(rizzo);
        console.log(danks);
    })
});








