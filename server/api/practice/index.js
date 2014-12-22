'use strict';
var express = require('express');
var controller = require('./practice.controller');
var router = express.Router();
var practiceAuth = require('../../auth/practiceAuth.service');
var auth = require('../../auth/auth.service');
var userController = require('./user.controller');
/** Authenticated By Admin **/
    /** GET **/
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id/user', auth.hasRole('admin'), controller.show);
router.get('/:id/user/:id2', auth.hasRole('admin'), controller.findSubById);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.get('/:id/facility', auth.hasRole('admin'), controller.show);
router.get('/:id/facility/:id2', auth.hasRole('admin'), controller.findSubById);
router.get('/:id/facility/:id2/hours', auth.hasRole('admin'), controller.findSubById);
router.get('/:id/facility/:id2/hours/:id3', auth.hasRole('admin'), controller.findSubById);
router.get('/:id/facility/:id2/contact.phone', auth.hasRole('admin'), controller.findSubById);
router.get('/:id/facility/:id2/contact.phone/:id3', auth.hasRole('admin'), controller.findSubById);
    /** POST **/
router.post('/', auth.hasRole('admin'), controller.create);
router.post('/:id/user', auth.hasRole('admin'), controller.createUser);
router.post('/:id/facility', auth.hasRole('admin'), controller.createSub);
router.post('/:id/facility/:id2/hours', auth.hasRole('admin'), controller.createSub);
router.post('/:id/facility/:id2/contact.phone', auth.hasRole('admin'), controller.createSub);
    /** PUT **/
router.put('/:id', controller.update);
//router.put('/:id/user/:id2/password', controller.changePassword);
router.put('/:id/facility/:id2', controller.updateSubById);
router.put('/:id/facility/:id2/hours/:id3', controller.updateSubById);
    /** DEELETE **/
router.delete('/:id', controller.destroy);
router.delete('/:id/user/:id2', controller.destroySub);
router.delete('/:id/facility/:id2', controller.destroySub);
router.delete('/:id/facility/:id2/hours/:id3', controller.destroySub);

/** Authenticated By Practice User **/
    /** GET **/
/*
router.get('/:id/user', auth.hasRole('admin'), userController.index);
router.get('/:id/user/me', auth.isAuthenticated(), userController.me);
router.put('/:id/user/:id2/password', auth.isAuthenticated(), userController.changePassword);
router.get('/:id/user/:id2', auth.isAuthenticated(), userController.show);
*/
router.post('/:id/user', userController.createSub);


//Auth By Practice User
router.get('/me', practiceAuth.isAuthenticated(), controller.me);


module.exports = router;