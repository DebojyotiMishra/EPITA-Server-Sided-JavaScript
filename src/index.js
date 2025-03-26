require('dotenv').config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;
const userRoutes = require("./routes/users")
const { hashPassword } = require("./middleware/password-encrypt")
const requestLogger = require('./middleware/logger');
const connectDB = require("./utils/db");
const productRoutes = require("./routes/products");
const invoiceRoutes = require("./routes/invoices");
const cors = require('cors');

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// Ensure uploads directory exists
const uploadsPath = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadsPath, { recursive: true });

// Serve static files
app.use(express.static('src/public'));
app.use('/uploads', express.static(uploadsPath));

// Connect to database
connectDB();

// ROUTES
app.get("/", (req, res) => {
  res.send("Welcome to my API ! e-commerce backed 🤳")
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use(requestLogger);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
