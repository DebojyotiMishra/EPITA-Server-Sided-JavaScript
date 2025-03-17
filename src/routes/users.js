const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.send("User's Page!");
});

router.post("/", (req, res) => {
  console.log('POST request received');
  console.log('Request body:', req.body);
  const { firstName, lastName, password } = req.body;
  res.send(`User ${firstName} ${lastName} created! Your password is ${password}`);
});

module.exports = router;