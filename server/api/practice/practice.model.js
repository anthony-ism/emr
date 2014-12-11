'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var address = {
    number: Number,
    direction: String,
    street: String,
    zip5: Number,
    zip4: Number,
    country: String
}


var phone = {
    description: String,
    number: String
}

var contact = {
    address : address,
    phone : [ phone ],
    email: String,
    canSMS: Boolean,
    canVoice: Boolean,
    canEmail: Boolean,
    preferred: Number

}

var day = {
    day: String,
    start: Number,
    end: Number
}


var PracticeSchema = new Schema({
    name: String,
    facility: [{
        name: String,
        contact: contact,
        hours: [ day ]
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