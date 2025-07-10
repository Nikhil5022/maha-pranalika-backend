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
  verified: { 
    type: Boolean, 
    default: false 
  },
  
  firm_registration: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firm'  // ✅ fixed
  }],
  cibil_score_restoration: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CibilRepair'  // ✅ fixed
  }],
  cibil_training: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CibilTraining'  // ✅ fixed
  }],
  visa_assistance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VisaAssistance'  // ❗ Make sure to create and register this model correctly
  }],
  msme: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MSMECluster'  // ✅ fixed
  }],

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
