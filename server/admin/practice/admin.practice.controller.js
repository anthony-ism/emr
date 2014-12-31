'use strict';

var _ = require('lodash');
var Practice = require('../../api/practice/practice.model');
var auth = require('../../auth/practiceAuth.service');

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
                obj += generateSubParams(params[i]);
        }
    }
    return obj;
}

exports.index = function(req, res) {
    Practice.find(function (err, practices) {
        if(err) { return handleError(res, err); }
        return res.json(200, practices);
  });
};

exports.read = function(req, res) {
    Practice.findById(req.params.id, function (err, practice) {
        var params = req.originalUrl.split("/");
        params.splice(3, 1);
        var obj = eval(generateEval(params));
        return res.json(obj);
    });
};

function handleError(res, err) {
    return res.send(500, err);
}