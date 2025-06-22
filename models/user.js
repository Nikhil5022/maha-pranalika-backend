const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /\S+@\S+\.\S+/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  firm_registration: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FirmRegistration'
  }],
  cibil_score_restoration: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CibilScoreRestoration'
  }],
  cibil_training: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CibilTraining'
  }],
  visa_assistance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VisaAssistance'
  }],
  msme: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MSME'
  }],

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
