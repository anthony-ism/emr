'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



var contact = require('../../genericModels/contact.js');
var name = require('../../genericModels/name.js');



var ReferralSchema = new Schema({
  patient: {
      name: name.name,
      dob: Date,
      contact: contact,
      antibiotics: Boolean
  },
  doctor: {
    name: name.name,
    contact: contact.contact
  },
    reason: [ String ],
    other: {
        sendPads: Boolean,
        appointment: String,
        cemented: Boolean,
        contact: Boolean,
        notes: String
    },
    photo: [{
        status: String,
        file: String
    }]
});

module.exports = mongoose.model('Referral', ReferralSchema);