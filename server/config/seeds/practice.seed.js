/**
 * Created by anthony on 12/12/14.
 */

exports.Practice =  [{
    name: "Rza's Practice",
    facility: [{
        name: "Down town office",
        contact: {
            address: {
                number: 1022,
                direction: "",
                street: "Trenton Pl",
                zip5: 19801,
                country: "United States"
            },
            phone: [{description: "Office", number: "2679753526"}],
            email: "rizzo0917@gmail.com",
            canSMS: 1,
            canVoice: 1,
            canEmail: 1,
            preferred: 1
        },
        hours: [{
            day: "Monday",
            start: 8,
            end: 17
        }]
    }],
    user: [{
        provider: 'practice',
        role: 'user',
        name: {
            first: "Test",
            middle: "Middle",
            last: "Last"
        },
        email: 'test@test.com',
        password: 'test'
    },
        {
            provider: 'practice',
            role: 'admin',
            name: {
                first: "Admin",
                middle: "Middle",
                last: "Last"
            },
            email: 'admin@admin.com',
            password: 'admin'
        }],
    active: true
},
{
    name: "Danky's Office",
    facility: [{
        name: "Seattle Office",
        contact: {
            address: {
                number: 2010,
                direction: "",
                street: "Westlake Drive",
                zip5: 80101,
                country: "United States"
            },
            phone: [{description: "Office", number: "2123321112"}],
            email: "jpdanks@gmail.com",
            canSMS: 1,
            canVoice: 1,
            canEmail: 1,
            preferred: 1
        },
        hours: [{
            day: "Tuesday",
            start: 8,
            end: 17
        }]
    }],
    user: [{
        provider: 'practice',
        name: {
            first: "Dankys",
            middle: "Middle",
            last: "Last"
        },
        email: 'jpdanks@gmail.com',
        password: 'dankys',
        role: 'user'
    },
        {
            provider: 'practice',
            role: 'admin',
            name: {
                first: "Admin",
                middle: "Middle",
                last: "Last"
            },
            email: 'kingtut@gmail.com',
            password: 'admin'
        }],
    active: true
}]
