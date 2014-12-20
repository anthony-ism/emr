'use strict';

var _ = require('lodash');
var Practice = require('./practice.model');
var auth = require('../../auth/practiceAuth.service');

// Get list of practices
exports.index = function(req, res) {
    Practice.find(function (err, practices) {
        if(err) { return handleError(res, err); }
        return res.json(200, practices);
  });
};

exports.me = function(req, res, next) {
    var userId = req.user._id;
    Practice.findOne({'user._id': userId}, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
        //TO DO Return user sans salt and hashedpasswords
        if (err) return next(err);
        if (!user) return res.json(401);
        res.json(user);
    });
};

// Get a single practice or any of its subdocuments by property name
exports.show = function(req, res) {
    var originalUrl = req.originalUrl;
    Practice.findById(req.params.id, function (err, practice) {
        if(err) { return handleError(res, err); }
        if(!practice) { return res.send(404); }
        var params = originalUrl.split("/");
        if (practice._doc[params[4]] !== undefined)
            return res.json(practice._doc[params[4]]);
        return res.json(practice);
  });
};


// Get a single practice subdocument by id
exports.findSubById = function(req, res) {
    var originalUrl = req.originalUrl;
    Practice.findById(req.params.id, function (err, practice) {
        if(err) { return handleError(res, err); }
        if(!practice) { return res.send(404); }
        var params = originalUrl.split("/");
        try {
            if (practice[params[4]] !== undefined && params.length === 6)
            {
                return res.json(practice[params[4]].id(params[5]));
            }
            else if (params.length === 7)
            {

                if (practice[params[4]].id(params[5])[params[6]] !== undefined)
                    return res.json(practice[params[4]].id(params[5])[params[6]]);
                else
                {
                    var subParams = params[6].split(".");
                    return res.json(practice[params[4]].id(params[5])[subParams[0]][subParams[1]]);
                }
            }
            else if (practice[params[4]].id(params[5])[params[6]] !== undefined && params.length === 8)
            {
                return res.json(practice[params[4]].id(params[5])[params[6]].id(params[7]));
            }
        } catch(err)
        {
            console.log(err);
            return res.send(500);
        }
    });
};


// Creates a new practice in the DB.
exports.create = function(req, res) {
  Practice.create(req.body, function(err, practice) {
    if(err) { return handleError(res, err); }
    return res.json(201, practice);
  });
};


exports.createSub = function(req, res) {
    var originalUrl = req.originalUrl;
    Practice.findById(req.params.id, function (err, practice) {
        if (err) { return handleError(res, err); }
        if (!practice) { return res.send(404); }
        var params = originalUrl.split("/");


        if (practice[params[4]] !== undefined && params.length === 5)
            practice[params[4]].push(req.body);
        else if (params.length === 7)
        {
            if (practice[params[4]].id(params[5])[params[6]] !== undefined)
                practice[params[4]].id(params[5])[params[6]].push(req.body);
            else
            {
                var subParams = params[6].split(".");
                practice[params[4]].id(params[5])[subParams[0]][subParams[1]].push(req.body);
            }
        }

        practice.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, practice[params[4]]);
        });
    });
};


// Updates an existing practice in the DB.
exports.updateSubById = function(req, res) {
    var originalUrl = req.originalUrl;
    var object;
    if(req.body._id) { delete req.body._id; }
    Practice.findById(req.params.id, function (err, practice) {
        if (err) { return handleError(res, err); }
        if(!practice) { return res.send(404); }
        var params = originalUrl.split("/");
        if (practice[params[4]] !== undefined && params.length === 6)
            object = practice[params[4]].id(params[5]);
        else if (practice[params[4]].id(params[5])[params[6]] !== undefined && params.length === 8)
            object = practice[params[4]].id(params[5])[params[6]].id(params[7]);

        for (var key in req.body)
        {
            if (object[key] !== undefined)
                object.set(key, req.body[key]);
        }

        practice.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, object);
        });
    });
};


// Updates an existing practice in the DB.
exports.update = function(req, res) {
    var originalUrl = req.originalUrl;
    if(req.body._id) { delete req.body._id; }
    Practice.findById(req.params.id, function (err, practice) {
        if (err) { return handleError(res, err); }
        if(!practice) { return res.send(404); }
        var updated = _.merge(practice, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
                return res.json(200, practice);
            });
        });
};

// Deletes a practice from the DB.
exports.destroy = function(req, res) {
  Practice.findById(req.params.id, function (err, practice) {
    if(err) { return handleError(res, err); }
    if(!practice) { return res.send(404); }
    practice.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Deletes a practice from the DB.
exports.destroySub = function(req, res) {
    var originalUrl = req.originalUrl;
    var object;
    if(req.body._id) { delete req.body._id; }
    Practice.findById(req.params.id, function (err, practice) {
        if (err) { return handleError(res, err); }
        if(!practice) { return res.send(404); }
        var params = originalUrl.split("/");
        if (practice[params[4]] !== undefined && params.length === 6)
            object = practice[params[4]].pull({_id: params[5]});
        else if (practice[params[4]].id(params[5])[params[6]] !== undefined && params.length === 8)
            object = practice[params[4]].id(params[5])[params[6]].pull({_id: params[7]});

        practice.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, object);
        });

    });
};

/**
 * Creates a new user
 */
exports.createUser = function (req, res, next) {
    var originalUrl = req.originalUrl;
    var email = req.body.email;


    Practice.findOne({'user.email': email}, function(err, practice) {
        if (practice === null )
        {
            Practice.findById(req.params.id, function (err, practice) {
                if (err) {
                    return handleError(res, err);
                }
                if (!practice) {
                    return res.send(404);
                }
                var params = originalUrl.split("/");
                if (practice[params[4]] !== undefined && params.length === 5)
                    practice[params[4]].push(req.body);


                var newUser = practice[params[4]][practice[params[4]].length - 1];
                newUser.provider = 'practice';
                practice.save(function (err) {
                    if (err) { return handleError(res, err); }
                    for (var i =0; i < practice.user.length; i++)
                    {
                        if (practice.user[i].email === email)
                        {
                            var token = auth.signToken(practice.user[i]._id, practice.user[i].email);
                            res.json({ token: token });
                        }
                    }
                });
            });
        }
        else
        {
            var err = {};
            err.message = "Email Already Exists";
            return handleError(res, err);
        }
    });

    /**
     * Change a users password
     */
    exports.changePassword = function(req, res, next) {
        var userId = req.user._id;
        var oldPass = String(req.body.oldPassword);
        var newPass = String(req.body.newPassword);

        Practice.findOne({'user._id': userId}, function (err, practice) {

            for (var i =0; i < practice.user.length; i++)
            {
                if (practice.user[i].email === email)
                {
                    if (practice.user[i].authenticate(oldPass)) {
                        practice.user[i].password = newPass;
                        practice.save(function (err) {
                            if (err) {
                                return handleError(res, err);
                            }
                        });o
                    }
                    else
                    {
                        res.send(403);

                    }
                }
            }

            if(user.authenticate(oldPass)) {
                user.password = newPass;
                user.save(function(err) {
                    if (err) return validationError(res, err);
                    res.send(200);
                });
            } else {
                res.send(403);
            }
        });
    };

};

function handleError(res, err) {
  return res.send(500, err);
}