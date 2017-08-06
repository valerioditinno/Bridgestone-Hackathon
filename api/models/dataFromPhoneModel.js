'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DataFromPhoneSchema = new Schema({
  x: {
    type: String
  },
  y: {
    type: String
  },
  z: {
    type: String
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DataFromPhones', DataFromPhoneSchema);