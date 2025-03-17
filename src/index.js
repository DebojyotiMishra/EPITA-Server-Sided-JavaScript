const express = require("express");
const app = express();
const port = 3000;
const userRoutes = require("./routes/users")
const { hashPassword } = require("./middleware/password-encrypt")
const requestLogger = require('./middleware/logger');
const connectDB = require("./utils/db");
const productRoutes = require("./routes/products");

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
});

app.use(express.static('src/public'));

// Connect to database
connectDB();

// ROUTES
app.get("/", (req, res) => {
  res.send("Welcome to my API ! e-commerce backed 🤳")
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use(requestLogger);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
