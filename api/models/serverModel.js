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
  Session: {
    type: String
  },
  Errors: {
    type: Number,
    default: 0
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


var SessionSchema = new Schema({
  Username: {
    type: String
  },
  Site:{
    type: Boolean,
    default: false
  },
  Timestamp: {
    type: String
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  lat_start: {
    type: Number
  },
  lng_start: {
    type: Number
  },
  lat_end: {
    type: Number
  },
  lng_end: {
    type: Number
  },
  last_update: {
    type: String,
    default: "-1"
  },
  first_update: {
    type: String,
    default: "-1"
  },
  total_distance: {
    type: Number,
    default: 0
  },
  total_error: {
    type: Number,
    default: 0
  },
  score:{
    type: Number,
    default: 0
  }
});


var TaskAvgSchema = new Schema({
  x: {
    type: Number
  },
  y: {
    type: Number
  },
  z: {
    type: Number
  },
  lat: {
    type: Number
  },
  lng: {
    type: Number
  },
  UserID: {
    type: String
  },
  Session: {
    type: String
  },
  Errors: {
    type: Number,
    default: 0
  },
  Timestamp:{
    type: String
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tasks', TaskSchema);
module.exports = mongoose.model('TasksAvg', TaskAvgSchema, 'TasksAvg');
module.exports = mongoose.model('Users', UserSchema, 'Users');
module.exports = mongoose.model('Sessions', SessionSchema, 'Sessions');