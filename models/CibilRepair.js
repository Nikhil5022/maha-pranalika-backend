const mongoose = require('mongoose');
const CibilRepairSchema = new mongoose.Schema({
    fullName: String,
    dob: Date,
    mobile: String,
    email: String,
    address: String,
    pan: String,
    aadhaar: String,
    occupation: String,
    income: String,
    cibilScore: String,
    hasLoan: String,
    loanType: String,
    bank: String,
    emi: String,
    issues: [String],
    documents: {
      panCard: String,
      aadhaarCard: String,
      cibilReport: String,
      bankStatement: String,
      salary: String,
    },
    declaration: Boolean,
    signatureDate: Date,
  });
  module.exports = mongoose.model('CibilRepair', CibilRepairSchema);