const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
  basic_details: {
    fullName: { type: String, required: true, trim: true },
    fatherSpouseName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    altContact: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true }
  },

  firm_details: {
    firmName: { type: String, required: true, trim: true },
    registrationType: { type: String, required: true, trim: true },
    businessNature: { type: String, required: true, trim: true },
    officeAddress: { type: String, required: true, trim: true }
  },

  partner_details: {
    director2Name: { type: String, required: true, trim: true },
    director2Email: { type: String, required: true, trim: true },
    pan: { type: String, required: true, trim: true },
    aadhaar: { type: String, required: true, trim: true },
    addressProof: { type: String, required: true, trim: true }
  },

  documents: {
    panCard: { type: String, required: true, trim: true }, // e.g., file path or URL
    aadhaarCard: { type: String, required: true, trim: true },
    photos: { type: String, required: true, trim: true },
    addressProofDoc: { type: String, required: true, trim: true },
    dsc: { type: String, required: true, trim: true },
    noc: { type: String, required: true, trim: true }
  },

  declaration: {
    signature: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    declared: { type: Boolean, required: true }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Firm', firmSchema);
