'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var contact = require('../../genericModels/contact.js');


var PracticeSchema = new Schema({
    name: String,
    facility: [{
        name: String,
        contact: contact.contact,
        hours: [ {
            day: String,
            start: Number,
            end: Number
        }]
    }],
    user: [
        {
            name: String,
            email: { type: String, lowercase: true },
            role: {
                type: String,
                default: 'user'
            },
            hashedPassword: String,
            provider: String,
            salt: String
        }
    ],
    active: Boolean
});

module.exports = mongoose.model('Practice', PracticeSchema);