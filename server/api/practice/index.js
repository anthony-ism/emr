'use strict';

var express = require('express');
var controller = require('./practice.controller');
var router = express.Router();
var auth = require('../../auth/auth.service');


router.get('/', auth.hasRole('admin'), controller.index);

router.get('/:id/user', controller.show);
router.get('/:id/user/:id2', controller.findSubById); //abstract
router.get('/:id', controller.show);
router.get('/:id/facility', controller.show);
router.get('/:id/facility/:id2', controller.findSubById);
router.get('/:id/facility/:id2/hours', controller.findSubById);
router.get('/:id/facility/:id2/hours/:id3', controller.findSubById);


router.post('/', controller.create);
router.put('/:id/user', controller.createSub); //abstract


router.put('/:id', controller.update);
router.put('/:id/user/:id2', controller.updateSubById); //abstract
router.put('/:id/facility/:id2', controller.updateSubById); //abstract
router.put('/:id/facility/:id2/hours/:id3', controller.updateSubById);


router.patch('/:id', controller.update);


router.delete('/:id', controller.destroy);
router.delete('/:id/user/:id2', controller.destroySub);

module.exports = router;