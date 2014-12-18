var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (Practice, config) {
  passport.use('practice', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {


      Practice.findOne({'user.email': email}, function(err, practice) {
        if (err) return done(err);

        if (!practice) {
          return done(null, false, { message: 'This email is not registered.' });
        }

        for (var i =0; i < practice.user.length; i++)
        {
            if (practice.user[i].email == email)
            {
                if (!practice.user[i].authenticate(password)) {
                    return done(null, false, { message: 'This password is not correct.' });
                }
            }
        }
        return done(null, practice);
      });
    }
  ));
};