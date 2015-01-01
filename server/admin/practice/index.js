'use strict';
var express = require('express');
var controller = require('../../api/practice/practice.controller');

var router = express.Router();
var practiceAuth = require('../../auth/practiceAuth.service');
var auth = require('../../auth/auth.service');
var userController = require('./admin.user.controller');

    /** GET **/
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.read);
router.get('/:id/user', auth.hasRole('admin'), controller.read);
router.get('/:id/user/:id2', auth.hasRole('admin'), controller.read);
router.get('/:id/facility', auth.hasRole('admin'), controller.read);
router.get('/:id/facility/:id2', auth.hasRole('admin'), controller.read);
router.get('/:id/facility/:id2/hours', auth.hasRole('admin'), controller.read);
router.get('/:id/facility/:id2/hours/:id3', auth.hasRole('admin'), controller.read);
router.get('/:id/facility/:id2/contact.phone', auth.hasRole('admin'), controller.read);
router.get('/:id/facility/:id2/contact.phone/:id3', auth.hasRole('admin'), controller.read);

    /** POST **/
router.post('/', auth.hasRole('admin'), controller.create)
router.post('/:id/user', auth.hasRole('admin'), controller.createUser);
/*
router.post('/:id/facility', auth.hasRole('admin'), controller.createSub);
router.post('/:id/facility/:id2/hours', auth.hasRole('admin'), controller.createSub);
router.post('/:id/facility/:id2/contact.phone', auth.hasRole('admin'), controller.createSub);
*/
    /** PUT **/
router.put('/:id', auth.hasRole('admin'), controller.update);
router.put('/:id/user/:id2/password', auth.hasRole('admin'), controller.changePassword);
/*
router.put('/:id/facility/:id2', auth.hasRole('admin'), controller.updateSubById);
router.put('/:id/facility/:id2/hours/:id3', controller.auth.hasRole('admin'), updateSubById);
*/
    /** DELETE **/
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
/*
router.delete('/:id/user/:id2', auth.hasRole('admin'), controller.destroySub);
router.delete('/:id/facility/:id2', auth.hasRole('admin'), controller.destroySub);
router.delete('/:id/facility/:id2/hours/:id3', auth.hasRole('admin'), controller.destroySub);
*/
module.exports = router;