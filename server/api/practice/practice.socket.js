/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Practice = require('./practice.model');

exports.register = function(socket) {
  Practice.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Practice.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('practice:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('practice:remove', doc);
}