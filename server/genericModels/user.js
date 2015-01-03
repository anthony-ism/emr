/**
 * Created by anthony on 12/12/14.
 */
var name = require('./name.js');
var contact = require('./contact.js');


exports.user = {
    name: name.name,
    contact: contact.contact,
    email: { type: String, lowercase: true },
    role: {
        type: String,
        default: 'user'
    },
    hashedPassword: String,
    provider: String,
    salt: String,
    otp: [{
        token: String,
        lastUpdated: Date,
        ip: String
    }]
}

