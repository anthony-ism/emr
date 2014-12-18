'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/user.model');
var Practice = require('../api/practice/practice.model');

// Passport Configuration
require('./practice/passport').setup(Practice, config);

require('./local/passport').setup(User, config);


var router = express.Router();

router.use('/practice', require('./practice'));
router.use('/local', require('./local'));

module.exports = router;