'use strict';
var express = require('express');
var controller = require('./practice.controller');
var router = express.Router();
var practiceAuth = require('../../auth/practiceAuth.service');
var auth = require('../../auth/auth.service');

    /** GET **/
    router.get('/me', practiceAuth.isAuthenticated(), controller.me);
    router.get('/user/me', practiceAuth.isAuthenticated(), controller.userMe);
    router.get('/user', practiceAuth.isAuthenticated(), controller.show);
    router.get('/facility', practiceAuth.isAuthenticated(), controller.show);
    router.get('/facility/:id2', practiceAuth.isAuthenticated(), controller.findSubById);
    router.get('/facility/:id2/hours', practiceAuth.isAuthenticated(), controller.findSubById);
    router.get('/facility/:id2/hours/:id3', practiceAuth.isAuthenticated(), controller.findSubById);
    router.get('/facility/:id2/contact.phone', practiceAuth.isAuthenticated(), controller.findSubById);
    router.get('/facility/:id2/contact.phone/:id3', practiceAuth.isAuthenticated(), controller.findSubById);

    /** POST **/
    router.post('/facility', practiceAuth.isAuthenticated(), controller.createSub);

    /** PUT **/
    router.put('/facility/:id', practiceAuth.isAuthenticated(), controller.updateSubById);

    /** DELETE **/
    module.exports = router;