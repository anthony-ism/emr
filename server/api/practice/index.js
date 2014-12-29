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
    router.post('/user', practiceAuth.isAuthenticated(), controller.createUser);
    router.post('/facility', practiceAuth.isAuthenticated(), controller.createSub);
    router.post('/facility/:id2/hours', practiceAuth.isAuthenticated(), controller.createSub);
    router.post('/facility/:id2/contact.phone', practiceAuth.isAuthenticated(), controller.createSub);


    /** PUT **/
    router.put('/user/password', practiceAuth.isAuthenticated(), controller.changePassword);
    router.put('/facility/:id2', practiceAuth.isAuthenticated(), controller.updateSubById);
    router.put('/facility/:id2/hours/:id3', practiceAuth.isAuthenticated(), controller.updateSubById);
    router.put('/facility/:id2/contact.phone/:id3', practiceAuth.isAuthenticated(), controller.updateSubById);


    /** DELETE **/
    router.delete('/facility/:id2', practiceAuth.isAuthenticated(), controller.destroySub);
    router.delete('/facility/:id2/hours/:id3', practiceAuth.isAuthenticated(), controller.destroySub);
    router.delete('/facility/:id2/contact.phone/:id3', practiceAuth.isAuthenticated(), controller.destroySub);


module.exports = router;