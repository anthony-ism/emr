/**
 * Created by anthony on 12/12/14.
 */


var address = require('./address.js');
var phone = require('./phone.js');

exports.contact = {
        address : address.address,
        phone : [ phone.phone ],
        email: String,
        canSMS: Boolean,
        canVoice: Boolean,
        canEmail: Boolean,
        preferred: Number
}
