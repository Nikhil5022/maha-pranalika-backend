const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = require('../cloudinaryStorage');
const upload = multer({ storage });
const user = require('../models/User');
const CibilReapir=require('../models/CibilRepair')

router.post('/register-cibil', upload.fields([
    { name: 'panCard' },
    { name: 'aadhaarCard' },
    { name: 'cibilReport' },
    { name: 'bankStatement' },
    { name: 'salary' }
  ]), async (req, res) => {
    try {
      console.log("Form fields:", req.body); // All your text fields
      console.log("Uploaded files:", req.files); // All uploaded files
      const formData=req.body;
      const userId=formData.userId;
      console.log("user:",userId);
      // Example: get full name
      const fullName = req.body.fullName;
  
      // Example: get PAN card file path
      const panCardUrl = req.files['panCard']?.[0]?.path || null;
  
      // Create and save the CIBIL Repair record
      const newRepair = new CibilReapir({
        fullName,
        dob: req.body.dob,
        mobile: req.body.mobile,
        email: req.body.email,
        address: req.body.address,
        pan: req.body.pan,
        aadhaar: req.body.aadhaar,
        occupation: req.body.occupation,
        income: req.body.income,
        cibilScore: req.body.cibilScore,
        hasLoan: req.body.hasLoan,
        loanType: req.body.loanType,
        bank: req.body.bank,
        emi: req.body.emi,
        issues: req.body['issues[]'], // may be array or string
        panCardUrl,
        aadhaarCardUrl: req.files['aadhaarCard']?.[0]?.path || null,
        cibilReportUrl: req.files['cibilReport']?.[0]?.path || null,
        bankStatementUrl: req.files['bankStatement']?.[0]?.path || null,
        salaryUrl: req.files['salary']?.[0]?.path || null,
        declaration: req.body.declaration === 'true',
        signatureDate: req.body.signatureDate,
        userId:req.body.userId
      });
  
      await newRepair.save();
    if(userId){
      const foundUser = await user.findById(userId);
    if (foundUser) {
        foundUser.cibil_score_restoration.push(newRepair._id);
        await foundUser.save();
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
   
  }
      
      return res.status(200).json({ message: "CIBIL repair registered" });
  
    } catch (err) {
      console.error("Error in register-cibil:", err);
      return res.status(500).json({ error: "Server error", details: err.message });
    }
  });
  module.exports=router
  