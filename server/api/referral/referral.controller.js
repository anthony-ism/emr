'use strict';

var _ = require('lodash');
var Referral = require('./referral.model');

// Get list of referrals
exports.index = function(req, res) {
  Referral.find(function (err, referrals) {
    if(err) { return handleError(res, err); }
    return res.json(200, referrals);
  });
};

// Get a single referral
exports.show = function(req, res) {
  Referral.findById(req.params.id, function (err, referral) {
    if(err) { return handleError(res, err); }
    if(!referral) { return res.send(404); }
    return res.json(referral);
  });
};

// Creates a new referral in the DB.
exports.create = function(req, res) {
  Referral.create(req.body, function(err, referral) {
    if(err) { return handleError(res, err); }
    return res.json(201, referral);
  });
};

// Updates an existing referral in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Referral.findById(req.params.id, function (err, referral) {
    if (err) { return handleError(res, err); }
    if(!referral) { return res.send(404); }
    var updated = _.merge(referral, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, referral);
    });
  });
};

// Deletes a referral from the DB.
exports.destroy = function(req, res) {
  Referral.findById(req.params.id, function (err, referral) {
    if(err) { return handleError(res, err); }
    if(!referral) { return res.send(404); }
    referral.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}