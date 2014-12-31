'use strict';

var _ = require('lodash');
var Practice = require('../../api/practice/practice.model');
var auth = require('../../auth/practiceAuth.service');
var crud = require('../../components/crud/crud');



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
        var obj = eval(crud.generateEval(params));
        return res.json(obj);
    });
};

function handleError(res, err) {
    return res.send(500, err);
}