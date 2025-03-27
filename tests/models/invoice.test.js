const chai = require('chai');
const expect = chai.expect;
const Invoice = require('../../src/models/Invoice');
const User = require('../../src/models/User');
const Product = require('../../src/models/Product');
require('../config');

describe('Invoice Model Test', () => {
  let userId, productId;
  
  before(async () => {
    // Create a test user and product for reference
    const user = await new User({
      firstName: 'Invoice',
      lastName: 'Test',
      email: 'invoice@example.com',
      password: 'password123',
      role: 'user'
    }).save();
    
    const product = await new Product({
      name: 'Invoice Test Product',
      description: 'Product for invoice tests',
      price: 49.99,
      stock: 20,
      category: 'Test'
    }).save();
    
    userId = user._id;
    productId = product._id;
  });
  
  it('should create a new invoice', async () => {
    const invoiceData = {
      user: userId,
      products: [{
        product: productId,
        quantity: 2,
        price: 49.99
      }],
      totalAmount: 99.98,
      status: 'pending',
      paymentMethod: 'credit_card'
    };
    
    const invoice = new Invoice(invoiceData);
    const savedInvoice = await invoice.save();
    
    expect(savedInvoice).to.have.property('_id');
    expect(savedInvoice.user.toString()).to.equal(userId.toString());
    expect(savedInvoice.products).to.have.length(1);
    expect(savedInvoice.totalAmount).to.equal(99.98);
    expect(savedInvoice.status).to.equal('pending');
  });
  
  it('should fail for invoice without required fields', async () => {
    const invoice = new Invoice({
      user: userId
    });
    
    let error = null;
    try {
      await invoice.save();
    } catch (err) {
      error = err;
    }
    
    expect(error).to.exist;
  });

  it('should only allow valid status values', async () => {
    const invoice = new Invoice({
      user: userId,
      products: [{
        product: productId,
        quantity: 1,
        price: 49.99
      }],
      totalAmount: 49.99,
      status: 'invalid_status',
      paymentMethod: 'credit_card'
    });
    
    let error = null;
    try {
      await invoice.save();
    } catch (err) {
      error = err;
    }
    
    expect(error).to.exist;
    expect(error.errors.status).to.exist;
  });
}); 