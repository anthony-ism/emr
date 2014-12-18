'use strict';

var express = require('express');
var controller = require('./practice.controller');
var router = express.Router();
var auth = require('../../auth/auth.service');



router.get('/', auth.hasRole('admin'), controller.index);

router.get('/me', auth.isAuthenticated(), controller.me);

//router.get('/:id/user', controller.show);
//router.get('/:id/user/:id2', controller.findSubById);
router.get('/:id', controller.show);
router.get('/:id/facility', controller.show);
router.get('/:id/facility/:id2', controller.findSubById);
router.get('/:id/facility/:id2/hours', controller.findSubById);
router.get('/:id/facility/:id2/hours/:id3', controller.findSubById);
router.get('/:id/facility/:id2/contact.phone', controller.findSubById);

router.post('/', controller.create);
//router.post('/:id/user', controller.createSub);
router.post('/:id/facility', controller.createSub);
router.post('/:id/facility/:id2/hours', controller.createSub);
router.post('/:id/facility/:id2/contact.phone', controller.createSub);


router.put('/:id', controller.update);
//router.put('/:id/user/:id2', controller.updateSubById);
router.put('/:id/facility/:id2', controller.updateSubById);
router.put('/:id/facility/:id2/hours/:id3', controller.updateSubById);


router.patch('/:id', controller.update);


router.delete('/:id', controller.destroy);
router.delete('/:id/user/:id2', controller.destroySub);
router.delete('/:id/facility/:id2', controller.destroySub);
router.delete('/:id/facility/:id2/hours/:id3', controller.destroySub);



var userController = require('./user.controller');

/*
router.get('/:id/user', auth.hasRole('admin'), userController.index);
router.get('/:id/user/me', auth.isAuthenticated(), userController.me);
router.put('/:id/user/:id2/password', auth.isAuthenticated(), userController.changePassword);
router.get('/:id/user/:id2', auth.isAuthenticated(), userController.show);
*/
router.post('/:id/user', userController.createSub);


module.exports = router;