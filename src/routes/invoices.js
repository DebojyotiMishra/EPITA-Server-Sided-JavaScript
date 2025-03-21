const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus
} = require("../controllers/invoiceController");
const auth = require('../middleware/auth');

// Protect all invoice routes
router.use(auth);

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.patch("/:id/status", updateInvoiceStatus);

module.exports = router;
