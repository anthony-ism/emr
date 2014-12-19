'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../practiceAuth.service');

var router = express.Router();

router.post('/', function(req, res, next) {
    var email = req.body.email;
  passport.authenticate('practice', function (err, practice, info) {
    var error = err || info;
    if (error) return res.json(401, error);
    if (!practice) return res.json(404, {message: 'Something went wrong, please try again.'});


      for (var i =0; i < practice.user.length; i++)
      {
          if (practice.user[i].email == email)
              var token = auth.signToken(practice.user[i]._id, practice.user[i].email);
      }


    res.json({token: token});
  })(req, res, next)
});

module.exports = router;