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
var Patient = require('../api/patient/patient.model');
var PatientSeed = require('./seeds/patient.seed');
var PracticeSeed = require('./seeds/practice.seed');
var Chance = require('chance');

var chance = new Chance();

Thing.find({}).remove(function() {
  Thing.create(ThingSeed.Thing)});

User.find({}).remove(function() {
  User.create(UserSeed.User, function() {
    }
  );
});

Practice.find({}).remove(function() {
    Practice.create(PracticeSeed.Practice, function() {
        Practice.find().exec(function(err, results) {
            var seed = [];
            for (var i = 0; i < results.length; i++)
            {
                var amount = chance.integer({min: 10, max: 20});
                for (var j = 0; j <= amount; j++)
                    seed.push(PatientSeed.new(results[i]._id));
            }
            console.log(seed);
            Patient.find({}).remove(function() {
                Patient.create(seed);
            });
        })
    })


});








