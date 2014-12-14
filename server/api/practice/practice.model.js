'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var contact = require('../../genericModels/contact.js');

var UserSchema = new Schema({
    name: String,
    email: { type: String, lowercase: true },
    role: {
        type: String,
        default: 'user'
    },
    hashedPassword: String,
    provider: String,
    salt: String
});


var HoursSchema = new Schema({
    day: String,
    start: Number,
    end: Number
});



var PracticeSchema = new Schema({
    name: String,
    facility: [{
        name: String,
        contact: contact.contact,
        hours: [ HoursSchema ]
    }],
    user: [UserSchema],
    active: Boolean
});

module.exports = mongoose.model('Practice', PracticeSchema);