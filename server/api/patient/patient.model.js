'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var contact = require('../../genericModels/contact.js');
var name = require('../../genericModels/name.js');
var address = require('../../genericModels/address.js');


var PatientSchema = new Schema({
    name: name.name,
    contact: contact.contact,
    dob: Date,
    ssn: Number,
    sex: String,
    referral: [String],
    payment: String,
    employer: {
        name: String,
        address: address.address
    },
    guarantor: {
        name: name.name,
        contact: contact.contact,
        dob: Date,
        sex: String,
        ssn: Number
    },
    insurance: [Object],
    demographic: {
        ethnicity: String,
        language: String,
        race: String
    },
    dentalInfo: Object,
    medicalInfo: Object,
    allergies: [String],
    medications: [String],
    active: Boolean,
    practiceID: String
});

module.exports = mongoose.model('Patient', PatientSchema);