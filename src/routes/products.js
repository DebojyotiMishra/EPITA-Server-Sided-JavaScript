const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProductById } = require("../controllers/productController");
const auth = require('../middleware/auth');

// Protect all product routes
router.use(auth);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;
