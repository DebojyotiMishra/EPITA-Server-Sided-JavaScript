const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.send("User's Page!");
});

router.post("/", (req, res) => {
  res.send("User's Page Post Request!");
}
);

module.exports = router;