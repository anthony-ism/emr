'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../practiceAuth.service');
var notp = require('notp');
var router = express.Router();
var Practice = require('../../api/practice/practice.model');
var controller = require('../../api/practice/practice.controller');
var config = require('../../config/environment');


router.post('/', function(req, res, next) {
    var email = req.body.email;
    passport.authenticate('practice', function (err, practice, info) {
        var cookieToken = req.body.cookieToken;
        var error = err || info;
        if (error) return res.json(401, error);
        if (!practice) return res.json(404, {message: 'Something went wrong, please try again.'});
        var user = controller.getUser(practice, email);
        var token = auth.signToken(user._id, user.email);
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
        var user = controller.getUser(practice, email);
        var otp = notp.totp.gen(user.hashedPassword, {time: 30});
        if(req.query.destination === "sms")
            res.json({otp: otp}); //TODO Service that sends the OTP to SMS
        else
        {
            config.email.transporter.sendMail({ //TODO Email Repository
                from: 'dentalemr1@gmail.com',
                to: 'rizzo0917@gmail.com',
                subject: 'Email OTP',
                text: 'OTP:' + otp
            });
        }
    });
});

module.exports = router;