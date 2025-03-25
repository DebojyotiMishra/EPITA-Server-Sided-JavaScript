const express = require("express");
const router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { userSignUp, createUser, userLogin } = require("../controllers/userController");
const { hashPassword } = require("../middleware/password-encrypt");
const User = require("../models/User");
const auth = require("../middleware/auth");
const upload = require("../middleware/multerConfig");

// Public routes
router.post("/signup", hashPassword, userSignUp);
router.post("/login", userLogin);
router.get("/form", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Protected routes
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/create", auth, hashPassword, createUser);

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/userUpdate", auth, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      user.imageUrl = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
