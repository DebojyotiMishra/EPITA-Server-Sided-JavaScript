const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus
} = require("../controllers/invoiceController");
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Protect all routes with authentication
router.use(auth);

// Regular user routes
router.post("/", createInvoice);
router.get("/:id", getInvoiceById);

// Admin only routes
router.get("/", adminAuth, getInvoices);  // Only admins can see all invoices
router.patch("/:id/status", adminAuth, updateInvoiceStatus);  // Only admins can update status

module.exports = router;
