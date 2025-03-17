const express = require("express");
const router = express.Router();
const path = require("path");
const { createUser, getUsers } = require("../controllers/userController");

router.get("/", getUsers);

router.post("/", createUser);

router.get("/form", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
