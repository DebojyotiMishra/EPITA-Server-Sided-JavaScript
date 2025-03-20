const Invoice = require("../models/Invoice");
const Product = require("../models/Product");

exports.createInvoice = async (req, res) => {
  try {
    const { userId, products, paymentMethod } = req.body;

    let totalAmount = 0;
    const invoiceProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          message: `Product not found with id: ${item.productId}` 
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product: ${product.name}` 
        });
      }

      invoiceProducts.push({
        product: item.productId,
        quantity: item.quantity,
        price: product.price
      });

      totalAmount += product.price * item.quantity;
    }

    const invoice = new Invoice({
      user: userId,
      products: invoiceProducts,
      totalAmount,
      paymentMethod
    });

    await invoice.save();

    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({ 
      message: "Invoice created successfully", 
      invoice 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating invoice", 
      error: error.message 
    });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('user', 'username email')
      .populate('products.product', 'name price');
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching invoices", 
      error: error.message 
    });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('user', 'username email')
      .populate('products.product', 'name price');
    
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching invoice", 
      error: error.message 
    });
  }
};

exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ 
      message: "Invoice status updated successfully", 
      invoice 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating invoice status", 
      error: error.message 
    });
  }
}; 