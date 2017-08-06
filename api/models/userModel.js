'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  name: {
      type: String
  },
  username: {
      type: String
  },
  password:{
      type: String
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  lastupdate_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }
});

module.exports = mongoose.model('Users', UserSchema);