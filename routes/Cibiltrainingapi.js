const express = require('express');
const CibilTraining = require('../models/CibilTraining');
const user = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const formData = req.body;
    const userId = formData.userId;
    console.log("Form Data:", formData);
    console.log("User:", userId);

    // Remove payment if included in request
    delete formData.payment;

    const newEntry = new CibilTraining(formData);
    await newEntry.save();
    console.log("New Entry ID:", newEntry._id);

    if (userId) {
      const foundUser = await user.findById(userId);
      if (foundUser) {
        foundUser.cibil_training.push(newEntry._id);
        await foundUser.save();
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    res.status(200).json({ message: 'Registration successful', entryId: newEntry._id });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

module.exports = router;
