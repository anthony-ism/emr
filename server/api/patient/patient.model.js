'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*

 name: name object
 contact: contact object
 dob: date
 ssn: int
 sex: string
 referral: array - referral object
 payment : enum
 employer: object
 name: string
 address : address object
 guarantor : object
 name: name object
 contact: contact object
 dob: date
 sex: string
 ssn: int
 insurance: array insurance object
 demographic:
 ethnicity - enum
 preferred language - enum
 race - enum
 dentalInfo: object
 ….
 medicalInfo: object
 ….
 allergies : array enum (“Need enumeration of possible allergy values”)
 medications : array (“Need enumeration of possible medication values”)



 */


var PatientSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Patient', PatientSchema);