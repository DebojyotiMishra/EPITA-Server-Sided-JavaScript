const chai = require('chai');
const sinon = require('sinon');
const Product = require('../../src/models/Product');
const { createProduct, getProducts, getProductById } = require('../../src/controllers/productController');
const expect = chai.expect;
require('../config');

describe('Product Controller Tests', () => {
  beforeEach(() => {
    this.req = {
      body: {},
      params: {},
      user: { id: '123456789012' }
    };
    
    this.res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
  });
  
  it('should create a new product', async () => {
    this.req.body = {
      name: 'Test Product',
      description: 'Test product description',
      price: 99.99,
      stock: 10,
      category: 'Test'
    };
    
    await createProduct(this.req, this.res);
    
    expect(this.res.status.calledWith(201)).to.be.true;
    expect(this.res.json.calledOnce).to.be.true;
    
    const product = await Product.findOne({ name: 'Test Product' });
    expect(product).to.exist;
    expect(product.price).to.equal(99.99);
  });
  
  it('should get all products', async () => {
    // Create some test products
    await Product.create([
      {
        name: 'Product 1',
        description: 'Description 1',
        price: 10.99,
        stock: 5,
        category: 'Category 1'
      },
      {
        name: 'Product 2',
        description: 'Description 2',
        price: 20.99,
        stock: 10,
        category: 'Category 2'
      }
    ]);
    
    await getProducts(this.req, this.res);
    
    expect(this.res.status.calledWith(200)).to.be.true;
    const response = this.res.json.firstCall.args[0];
    expect(response).to.be.an('array');
    expect(response).to.have.length(2);
  });
  
  it('should get a product by ID', async () => {
    const product = await Product.create({
      name: 'Single Product',
      description: 'Get by ID test',
      price: 15.99,
      stock: 3,
      category: 'Test'
    });
    
    this.req.params.id = product._id.toString();
    
    await getProductById(this.req, this.res);
    
    expect(this.res.status.calledWith(200)).to.be.true;
    const response = this.res.json.firstCall.args[0];
    expect(response).to.have.property('_id');
    expect(response.name).to.equal('Single Product');
  });
  
  it('should return 404 for non-existent product ID', async () => {
    this.req.params.id = '123456789012345678901234'; // Valid but non-existent ID
    
    await getProductById(this.req, this.res);
    
    expect(this.res.status.calledWith(404)).to.be.true;
    const response = this.res.json.firstCall.args[0];
    expect(response.message).to.equal('Product not found');
  });
}); 