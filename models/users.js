const mongoose = require('mongoose');

var journeySchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number,
  });

var userSchema = mongoose.Schema({
    name: String,
    firstname: String,
    mail: String,
    departureTime: String,
    password: String,
    lasttrip:  [journeySchema]
  });

  var userModel = mongoose.model('users', userSchema);

  module.exports = userModel;