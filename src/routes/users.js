const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.send("User's Page!");
});

router.post("/", (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !password) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    res.status(201).json({
      message: `User ${firstName} ${lastName} created successfully!`,
      user: { firstName, lastName }, // So we dont send password back
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.get("/form", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
