const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // handles only fields (not files)
const Visa = require('../models/Visa');
const User = require('../models/user');
function parseIfString(input) {
    if (typeof input === 'string') {
      try {
        return JSON.parse(input);
      } catch (err) {
        return input;
      }
    }
    return input;
  }
  
  router.post('/register-visa', upload.none(), async (req, res) => {
    try {
      const data = req.body;
      console.log("Visa form body:", data); // ✅ Should no longer be undefined
  
      const userId = data.userId;
  
      const visa = new Visa({
        userId:userId,
        personal_information: parseIfString(data.personal_information),
        consultation_details: parseIfString(data.consultation_details),
        education_experience: parseIfString(data.education_experience),
        languageProficiency: parseIfString(data.languageProficiency),
        addtionalDetails: parseIfString(data.addtionalDetails),
        documentedChecklist: parseIfString(data.documentedChecklist) || [],
        declaration: parseIfString(data.declaration),
        
        createdAt: new Date()
      });
  
      await visa.save();
  
      if (userId) {
        const foundUser = await User.findById(userId);
        if (foundUser) {
          foundUser.visa_assistance = foundUser.visa_assistance || [];
          foundUser.visa_assistance.push(visa._id);
          await foundUser.save();
        } else {
          return res.status(404).json({ message: 'User not found' });
        }
      }
  
      return res.status(200).json({ message: "Visa Overseas registered" });
  
    } catch (err) {
      console.error("Error in register-visa:", err);
      return res.status(500).json({ error: "Server error", details: err.message });
    }
  });
  module.exports=router;