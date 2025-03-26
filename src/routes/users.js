const express = require("express");
const router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  userSignUp,
  createUser,
  userLogin,
} = require("../controllers/userController");
const { hashPassword } = require("../middleware/password-encrypt");
const User = require("../models/User");
const auth = require("../middleware/auth");
const upload = require("../middleware/multerConfig");
const sharpMiddleware = require("../middleware/sharpMiddleware");

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

router.put(
  "/userUpdate",
  auth,
  upload.single("image"),
  sharpMiddleware(),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Enhanced debugging
      console.log("Headers:", req.headers);
      console.log("Content-Type:", req.headers["content-type"]);
      console.log("Body:", req.body);
      console.log("Files:", req.files);
      console.log("File:", req.file);
      console.log("Error:", req.fileValidationError);

      if (!req.file) {
        return res.status(400).json({
          error: "Error uploading the file. Wrong format?",
          validationError: req.fileValidationError,
        });
      }

      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      user.imageUrl = fileUrl;
      await user.save();

      res.json({
        message: "User updated successfully",
        user,
        fileUrl,
      });
    } catch (error) {
      console.error("Error in userUpdate:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
