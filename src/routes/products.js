const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProductById } = require("../controllers/productController");
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Protect all routes with authentication
router.use(auth);

// Public routes (authenticated users)
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin only routes
router.post("/", adminAuth, createProduct);  // Only admins can create products

module.exports = router;
