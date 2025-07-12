const mongoose = require('mongoose');

const visaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  personal_information: {
    fullName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true, trim: true },
    passportNumber: { type: String, required: true, trim: true },
    passportExpiry: { type: Date, required: true },
    phoneNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
  },
  consultation_details: {
    visaTypes: [{ type: String, trim: true }],
    otherVisaType: { type: String, trim: true },
    preferredCountries: [{ type: String, trim: true }],
    otherPreferredCountry: { type: String, trim: true },
    referrerName: { type: String, trim: true }
  },
  education_experience: {
    qualification: [{
      qualification: { type: String, trim: true },
      institute: { type: String, trim: true },
      year: { type: String, trim: true }
    }],
    currentOccupation: { type: String, trim: true },
    yearsOfExperience: { type: String, trim: true }
  },
  languageProficiency: {
    languages: [{
      language: { type: String, trim: true },
      speaking: { type: Boolean, default: false },
      reading: { type: Boolean, default: false },
      writing: { type: Boolean, default: false },
      examsTaken: { type: String, trim: true }
    }]
  },
  addtionalDetails: {
    previouslyappliedforvisa: { type: String, trim: true },
    anyvisarejections: { type: String, trim: true },
    anylegailissues: { type: String, trim: true }
  },
  documentedChecklist: [{ type: String, trim: true }],
  declaration: {
    signature: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    declared: { type: Boolean, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isResolved: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('VisaApplication', visaSchema);
