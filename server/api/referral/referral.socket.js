/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Referral = require('./referral.model');

exports.register = function(socket) {
  Referral.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Referral.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('referral:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('referral:remove', doc);
}