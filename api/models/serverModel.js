'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TaskSchema = new Schema({
  x: {
    type: String
  },
  y: {
    type: String
  },
  z: {
    type: String
  },
  Data: {
    type: String
  },
  UserID: {
    type: String
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});


var UserSchema = new Schema({
  Username: {
    type: String
  },
  Password: {
    type: String
  },
  UserID: {
    type: String
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tasks', TaskSchema);
module.exports = mongoose.model('Users', UserSchema, 'Users');