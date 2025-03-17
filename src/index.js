require('dotenv').config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require("./routes/users")
const { hashPassword } = require("./middleware/password-encrypt")
const limiter = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/logger');


// MIDDLEWARE
app.use(express.json());

// cors middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
   "Access-Control-Allow-Headers",
   "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  next()
 })

app.use(express.static('src/public'));

app.get("/", (req, res) => {
  res.send("Welcome to my API ! e-commerce backed 🤳")
 })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use("/api/users", userRoutes);

// Apply rate limiting
app.use('/api', limiter);

app.use(requestLogger);
