'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../practiceAuth.service');
var notp = require('notp');
var router = express.Router();
var Practice = require('../../api/practice/practice.model');


router.post('/', function(req, res, next) {
    var email = req.body.email;
  passport.authenticate('practice', function (err, practice, info) {
      var cookieToken = req.body.cookieToken;
      var error = err || info;
    if (error) return res.json(401, error);
    if (!practice) return res.json(404, {message: 'Something went wrong, please try again.'});


      for (var i =0; i < practice.user.length; i++)
      {
          if (practice.user[i].email == email)
          {
              var user = practice.user[i];
              var token = auth.signToken(practice.user[i]._id, practice.user[i].email);
          }
      }
      res.json({token: token, cookieToken: cookieToken});
  })(req, res, next)
});

router.get('/otp/:email', function(req, res, next) {
    var email = req.params.email;
    Practice.findOne({'user.email': email}, function(err, practice) {
        if (practice === null) //Send some bullshit practice not found
        {
            var otp = notp.totp.gen(new Date(), 30);
            res.json({otp: otp});
            return;
        }
        for (var i = 0; i < practice.user.length; i++) {
            if (practice.user[i].email == email) {
                var user = practice.user[i];
            }
            var otp = notp.totp.gen(user.hashedPassword, {time: 30}); //TODO Service that sends the OPT to SMS
            res.json({otp: otp});
        }
    });
});

module.exports = router;