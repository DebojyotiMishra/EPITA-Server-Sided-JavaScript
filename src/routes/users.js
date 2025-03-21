const express = require("express");
const router = express.Router();
const path = require("path");
const { userSignUp, createUser } = require("../controllers/userController");
const { hashPassword } = require("../middleware/password-encrypt");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/signup", hashPassword, userSignUp);

router.get("/form", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.post("/create", hashPassword, createUser);

module.exports = router;