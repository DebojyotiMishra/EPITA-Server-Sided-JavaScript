const chai = require('chai');
const expect = chai.expect;
const Product = require('../../src/models/Product');
require('../config');

describe('Product Model Test', () => {
  it('should create a new product', async () => {
    const productData = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 99.99,
      stock: 10,
      category: 'Electronics'
    };
    
    const product = new Product(productData);
    const savedProduct = await product.save();
    
    expect(savedProduct).to.have.property('_id');
    expect(savedProduct.name).to.equal(productData.name);
    expect(savedProduct.price).to.equal(productData.price);
    expect(savedProduct.category).to.equal(productData.category);
  });
  
  it('should fail for product without required fields', async () => {
    const product = new Product({
      name: 'Incomplete Product'
    });
    
    let error = null;
    try {
      await product.save();
    } catch (err) {
      error = err;
    }
    
    expect(error).to.exist;
    expect(error.errors.description).to.exist;
    expect(error.errors.price).to.exist;
    expect(error.errors.category).to.exist;
  });

  it('should not allow negative price', async () => {
    const product = new Product({
      name: 'Negative Price Product',
      description: 'This product has a negative price',
      price: -10.99,
      stock: 5,
      category: 'Test'
    });
    
    let error = null;
    try {
      await product.save();
    } catch (err) {
      error = err;
    }
    
    expect(error).to.exist;
    expect(error.errors.price).to.exist;
  });
}); 