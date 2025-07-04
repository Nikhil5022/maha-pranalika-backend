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

module.exports = router;
