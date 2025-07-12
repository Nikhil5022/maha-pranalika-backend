const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = require('../cloudinaryStorage');
const upload = multer({ storage });
const user = require('../models/user');
const CibilReapir = require('../models/CibilRepair')

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
    const formData = req.body;
    const userId = formData.userId;
    console.log("user:", userId);
    // Example: get full name
    const fullName = req.body.fullName;

    // Example: get PAN card file path
    const panCardUrl = req.files['panCard']?.[0]?.path || null;

    // Create and save the CIBIL Repair record
    const newRepair = new CibilReapir({
      fullName: req.body.fullName,
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
      issues: Array.isArray(req.body['issues[]']) ? req.body['issues[]'] : [req.body['issues[]']],
      documents: {
        panCard: req.files['panCard']?.[0]?.path || null,
        aadhaarCard: req.files['aadhaarCard']?.[0]?.path || null,
        cibilReport: req.files['cibilReport']?.[0]?.path || null,
        bankStatement: req.files['bankStatement']?.[0]?.path || null,
        salary: req.files['salary']?.[0]?.path || null,
      },
      declaration: req.body.declaration === 'true',
      signatureDate: req.body.signatureDate,
      userId: req.body.userId
    });


    await newRepair.save();
    if (userId) {
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

router.post('/resolveCibilRepair', async (req, res) => {
  const { userId, repairId } = req.body;
  if (!userId || !repairId) return res.status(400).json({ message: "userId and repairId are required" });

  try {
    const entry = await CibilReapir.findById(repairId);
    if (!entry) return res.status(404).json({ message: "CIBIL Repair entry not found" });

    entry.isResolved = true;
    await entry.save();

    res.status(200).json({ message: "CIBIL Repair marked as resolved" });
  } catch (err) {
    console.error("Resolve CIBIL Repair Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.post('/undoResolveCibilRepair', async (req, res) => {
  const { userId, repairId } = req.body;
  if (!userId || !repairId) return res.status(400).json({ message: "userId and repairId are required" });

  try {
    const entry = await CibilReapir.findById(repairId);
    if (!entry) return res.status(404).json({ message: "CIBIL Repair entry not found" });

    entry.isResolved = false;
    await entry.save();

    res.status(200).json({ message: "CIBIL Repair marked as unresolved" });
  } catch (err) {
    console.error("Undo Resolve CIBIL Repair Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.delete('/deleteCibilRepair', async (req, res) => {
  const { userId, repairId } = req.body;
  if (!userId || !repairId) return res.status(400).json({ message: "userId and repairId are required" });

  try {
    const deletedEntry = await CibilReapir.findByIdAndDelete(repairId);
    if (!deletedEntry) return res.status(404).json({ message: "CIBIL Repair entry not found" });

    const foundUser = await user.findById(userId);
    if (foundUser) {
      foundUser.cibil_score_restoration = foundUser.cibil_score_restoration.filter(id => id.toString() !== repairId);
      await foundUser.save();
    }

    res.status(200).json({ message: "CIBIL Repair entry deleted successfully" });
  } catch (err) {
    console.error("Delete CIBIL Repair Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router
