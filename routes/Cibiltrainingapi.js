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

router.post('/resolveCibilTraining', async (req, res) => {
  const { userId, trainingId } = req.body;
  if (!userId || !trainingId) return res.status(400).json({ message: "userId and trainingId are required" });

  try {
    const entry = await CibilTraining.findById(trainingId);
    if (!entry) return res.status(404).json({ message: "Training entry not found" });

    entry.isResolved = true;
    await entry.save();

    res.status(200).json({ message: "CIBIL Training marked as resolved" });
  } catch (err) {
    console.error("Resolve Training Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.post('/undoResolveCibilTraining', async (req, res) => {
  const { userId, trainingId } = req.body;
  if (!userId || !trainingId) return res.status(400).json({ message: "userId and trainingId are required" });

  try {
    const entry = await CibilTraining.findById(trainingId);
    if (!entry) return res.status(404).json({ message: "Training entry not found" });

    entry.isResolved = false;
    await entry.save();

    res.status(200).json({ message: "CIBIL Training marked as unresolved" });
  } catch (err) {
    console.error("Undo Resolve Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.delete('/deleteCibilTraining', async (req, res) => {
  const { userId, trainingId } = req.body;
  if (!userId || !trainingId) return res.status(400).json({ message: "userId and trainingId are required" });

  try {
    const deletedEntry = await CibilTraining.findByIdAndDelete(trainingId);
    if (!deletedEntry) return res.status(404).json({ message: "Training entry not found" });

    const foundUser = await user.findById(userId);
    if (foundUser) {
      foundUser.cibil_training = foundUser.cibil_training.filter(id => id.toString() !== trainingId);
      await foundUser.save();
    }

    res.status(200).json({ message: "CIBIL Training entry deleted successfully" });
  } catch (err) {
    console.error("Delete Training Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});


module.exports = router;
