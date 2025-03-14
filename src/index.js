const express = require("express");
const app = express();
const port = 3000;

// MIDDLEWARE
app.use((req, res, next) => {
  const calculation = 4 * 7;
  req.calculatedValue = calculation;
  next();
});

app.get("/", (req, res) => {
  res.send(`The calculated value is: ${req.calculatedValue}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
