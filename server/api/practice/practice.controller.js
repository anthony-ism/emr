'use strict';

var _ = require('lodash');
var Practice = require('./practice.model');
var auth = require('../../auth/practiceAuth.service');
var crud = require('../../components/crud/crud');


var getUser = function(practice, email)
{
    for (var i =0; i < practice.user.length; i++)
    {
        if (practice.user[i].email == email)
            return practice.user[i];
    }
}

var getUserById = function(practice, id)
{
    for (var i =0; i < practice.user.length; i++)
    {
        if (practice.user[i]._id == id)
            return practice.user[i];
    }
}


exports.create = function(req, res) {
    Practice.create(req.body, function(err, practice) {
        if(err) { return handleError(res, err); }
        return res.json(201, practice);
    });
}

//Return Logged in Practice
exports.me = function(req, res, next) {
    getPractice(req,res, function(req, res, err, practice) {
        res.json(practice);
    });
};

//Return Logged In user
exports.userMe = function(req, res, next) {
    getPractice(req,res, function(req, res, err, practice) {
        res.json(getUser(practice, req.user.email));
    });
};

var getPracticeWithHash = function(req, res, next)
{
    if (isAdmin(req)) {
        Practice.findById(req.params.id, function (err, practice) {
            if (!handleExceptions(err, res, practice))
                next(req, res, err, practice)
            else
                return handleExceptions(err, res, practice);
        });
    } else {
        Practice.findOne({'user._id': req.user._id}, function (err, practice) {
            if (!handleExceptions(err, res, practice))
                next(req, res, err, practice)
            else
                return handleExceptions(err, res, practice);
        });
    }
}


var isAdmin = function(req) {
    if (req.originalUrl.indexOf("/admin/") > -1)
        return true;
    else
        false;
}

var handleExceptions = function(err, res, practice) {
    if (err) {
        return handleError(res, err);
    }
    if (!practice) {
        return res.send(404);
    }
    return false;
}

var getPractice = function(req, res, next)
{
    if (isAdmin(req)) {
        Practice.findById(req.params.id, function (err, practice) {
            if (!handleExceptions(err, res, practice))
                next(req, res, err, practice)
            else
                return handleExceptions(err, res, practice);
        });
    } else {
        Practice.findOne({'user._id': req.user._id}, '-user.salt -user.hashedPassword', function (err, practice) {
            if (!handleExceptions(err, res, practice))
                next(req, res, err, practice)
            else
                return handleExceptions(err, res, practice);
        });
    }
}


exports.read = function(req, res) {
    getPractice(req,res, function(req, res, err, practice) {
        var params = req.originalUrl.split("/");
        if (isAdmin(req))
            params.splice(3, 1);
        var obj = eval(crud.generateEval(params));
        return res.json(obj);
    });
};

exports.createSub = function(req, res) {
    getPractice(req, res, function(req, res, err, practice){
        var params = req.originalUrl.split("/");
        var obj = eval(crud.generateEval(params));
        if (obj !== undefined)
            obj.push(req.body);
        practice.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, obj[obj.length -1]);
        });
    });
};


exports.update = function(req, res) {
    getPractice(req, res, function(req, res, err, practice){
        var params = req.originalUrl.split("/");
        if (isAdmin(req))
            params.splice(3, 1);
        var obj = eval(crud.generateEval(params));
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

exports.destroy = function(req, res) {
    getPractice(req, res, function(req, res, err, practice){
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
    getPractice(req, res, function(req, res, err, practice){
        var params = req.originalUrl.split("/");
        var _id = params.pop();
        var obj = eval(crud.generateEval(params));
        obj.pull({"_id": _id});
        practice.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, obj);
        });
    });
};

exports.index = function(req, res) {
    Practice.find(function (err, practices) {
        if(err) { return handleError(res, err); }
        return res.json(200, practices);
    });
};

/**
 * Creates a new user
 */
exports.createUser = function (req, res, next) {
    getPractice(req, res, function(req, res, err, practice){
        var user = getUser(practice, req.body.email);
        if (practice === null || user == null) {
            getPractice(req, res, function (req, res, err, practice) {
                var params = req.originalUrl.split("/");
                if (isAdmin(req))
                    params.splice(3, 1);
                var obj = eval(crud.generateEval(params));
                obj.push(req.body);
                var newUser = obj[obj.length - 1];
                newUser.provider = 'practice';
                practice.save(function (err) {
                    if (err) { return handleError(res, err); }
                    var user = getUser(practice, req.body.email);
                    var token = auth.signToken(user._id, user.email);
                    res.json({token: token});
                });
            });
        }
        else {
            var err = {};
            err.message = "Email Already Exists";
            return handleError(res, err);
        }
    });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
    getPracticeWithHash(req, res, function (req, res, err, practice) {
        if (isAdmin(req))
            var user = getUserById(practice, req.params.id2);
        else
            var user = getUser(practice, req.user.email);
        if (user && user.authenticate(String(req.body.oldPassword))) {
            user.password = String(req.body.newPassword);
            practice.save(function (err) {
                if (err) { return handleError(res, err) };
                var token = auth.signToken(user._id, user.email);
                res.json({token: token});

            });
        }
        else
            res.send(403);
    });
};

function handleError(res, err) {
  return res.send(500, err);
}