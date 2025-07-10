const express = require('express');
const router = express.Router();
require('dotenv').config();

const User = require('../models/user');

// POST /api/search
router.post("/search", async (req, res) => {
  try {
    const { email, page = 1, limit = 5 } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: "Search term is required and must be a string." });
    }

    // Create case-insensitive regex for name or email
    const regex = new RegExp(email, 'i');

    const query = {
      $or: [
        { email: regex },
        { name: regex }
      ]
    };

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalCount = await User.countDocuments(query);

    res.json({
      users,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
