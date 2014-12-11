/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Practice = require('../api/practice/practice.model');


Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});



Practice.find({}).remove(function() {
    Practice.create({
        name: "Rza's Practice",
        facility: [{
            name: "Down town office",
            contact: {
                address: {
                    number: 1022,
                    direction: "",
                    street: "Trenton Pl",
                    zip5: 19801,
                    country: "United States"
                },
                phone: [{description: "Office", number: "2679753526"}],
                email: "rizzo0917@gmail.com",
                canSMS: 1,
                canVoice: 1,
                canEmail: 1,
                preferred: 1
            },
            hours: [{
                day: "Monday",
                start: 8,
                end: 17
            }]
        }],
        user: [{
            provider: 'local',
            name: 'Test User',
            email: 'test@test.com',
            password: 'test'
        },
        {
            provider: 'local',
            role: 'admin',
            name: 'Admin',
            email: 'admin@admin.com',
            password: 'admin'
        }],
        active: true
    },
    {
        name: "Danky's Office",
        facility: [{
            name: "Seattle Office",
            contact: {
                address: {
                    number: 2010,
                    direction: "",
                    street: "Westlake Drive",
                    zip5: 80101,
                    country: "United States"
                },
                phone: [{description: "Office", number: "2123321112"}],
                email: "jpdanks@gmail.com",
                canSMS: 1,
                canVoice: 1,
                canEmail: 1,
                preferred: 1
            },
            hours: [{
                day: "Tuesday",
                start: 8,
                end: 17
            }]
        }],
        user: [{
            provider: 'local',
            name: 'Dankys',
            email: 'jpdanks@gmail.com',
            password: 'dankys'
        },
            {
                provider: 'local',
                role: 'admin',
                name: 'Admin',
                email: 'kingtut@gmail.com',
                password: 'admin'
            }],
        active: true
    },
        function() {
        console.log('finished populating practice');
    })
});








