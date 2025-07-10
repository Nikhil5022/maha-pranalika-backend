const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../cloudinaryStorage");
const upload = multer({ storage });
const user = require("../models/user");
const Firm = require("../models/Firm");
router.get('/getUsers', async (req, res) => {
    try {
        const users = await user.find({ role: "user" });
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/getUserById/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const foundUser = await user.findById(userId)
      .populate("firm_registration")
      .populate("cibil_score_restoration")
      .populate("cibil_training")
      .populate("msme");

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(foundUser);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
