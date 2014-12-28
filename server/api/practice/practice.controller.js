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
    Practice.findOne({'user._id': userId}, '-salt -hashedPassword', function(err, practice) { // don't ever give out the password or salt
        if (!practice) return res.json(401);
        for (var i =0; i < practice.user.length; i++)
        {
            practice.user[i].hashedPassword = null;
            practice.user[i].salt = null;
        }
        if (err) return next(err);
        res.json(practice);
    });
};


exports.userMe = function(req, res, next) {
    var userId = req.user._id;
    var userEmail = req.user.email;
    Practice.findOne({'user._id': userId}, '-salt -hashedPassword', function(err, practice) { // don't ever give out the password or salt
        if (!practice) return res.json(401);
        for (var i =0; i < practice.user.length; i++)
        {
            if (practice.user[i].email == userEmail)
            {
                practice.user[i].hashedPassword = null;
                practice.user[i].salt = null;
                res.json(practice.user[i]);
            }

        }
        if (err) return next(err);

    });
};


var getPractice = function(req, res, next)
{
    Practice.findOne({'user._id': req.user._id}, '-salt -hashedPassword', function (err, practice) {
        next(req, res, err, practice)
    });
}





    exports.show = function(req, res) {
        getPractice(req,res, function(req, res, err, practice) {
            if (err) {
                return handleError(res, err);
            }
            if (!practice) {
                return res.send(404);
            }

            var originalUrl = req.originalUrl;
            var params = originalUrl.split("/");
            return res.json(practice[params[3]]);
        });
    };



// Get a single practice subdocument by id
exports.findSubById = function(req, res) {
    getPractice(req, res, function(req, res, err, practice) {

        if(err) { return handleError(res, err); }
        if(!practice) { return res.send(404); }
        var params = req.originalUrl.split("/");
        var obj = eval(generateEval(params));
        return res.json(obj);

    })
};


// Creates a new practice in the DB.
exports.create = function(req, res) {
  Practice.create(req.body, function(err, practice) {
    if(err) { return handleError(res, err); }
    return res.json(201, practice);
  });
};


var generateSubParams = function(params)
{
    var result = "";
    var subParams = params.split(".");
    for (var i = 0; i < subParams.length; i++)
        result += "['" + subParams[i] + "']";
    return result;
}

var generateEval = function(params)
{
    var mongodb = require("mongodb"),
        objectid = mongodb.BSONPure.ObjectID;

    var obj = "";
    for (var i = 2; i < params.length; i++)
    {
        if (objectid.isValid(params[i]))
            obj += ".id('" + params[i] + "')";
        else
        {
            if (obj.length == 0)
                obj = params[i]
            else if (params[i].indexOf(".") == -1)
                obj += "['" + params[i] + "']";
            else
                obj += "['" + generateSubParams(params[i]) + "']";
        }
    }
    console.log(obj);
    return obj;
}

exports.createSub = function(req, res) {

    getPractice(req, res, function(req, res, err, practice){
        if (err) { return handleError(res, err); }
        if (!practice) { return res.send(404); }
        var params = req.originalUrl.split("/");
        var obj = eval(generateEval(params));

        if (obj !== undefined)
            obj.push(req.body);

        practice.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, obj[obj.length -1]);
        });
    });


};


// Updates an existing practice in the DB.
exports.updateSubById = function(req, res) {

    getPractice(req, res, function(req, res, err, practice){
        if (err) { return handleError(res, err); }
        if (!practice) { return res.send(404); }
        var params = req.originalUrl.split("/");
        var obj = eval(generateEval(params));

        for (var key in req.body)
        {
            if (obj[key] !== undefined)
                obj.set(key, req.body[key]);
        }

        practice.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, obj);
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