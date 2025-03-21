const User = require("../models/User");
const { hashPassword } = require("../middleware/password-encrypt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.userSignUp = async (req, res) => {
  const { firstName, lastName, email, password, role, imageUrl } = req.body;
  const hashedPassword = req.hashedPassword;
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    imageUrl,
    inventory: [],
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, imageUrl } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password: req.hashedPassword,
      role,
      imageUrl,
      inventory: [],
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
