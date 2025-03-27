const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../../src/index'); // Adjust path as needed
const User = require('../../src/models/User');
const Product = require('../../src/models/Product');
const expect = chai.expect;
require('../config');

chai.use(chaiHttp);

describe('API Integration Tests', () => {
  let userToken, adminToken, productId;
  
  before(async () => {
    // Set JWT secret for tests
    process.env.JWT_SECRET = 'testsecret';
    
    // Create a regular user
    const hashedPassword = await bcrypt.hash('userpass', 10);
    const user = await User.create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user'
    });
    
    // Create an admin user
    const adminHashedPassword = await bcrypt.hash('adminpass', 10);
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: adminHashedPassword,
      role: 'admin'
    });
    
    // Create tokens
    userToken = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    adminToken = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Create a test product
    const product = await Product.create({
      name: 'API Test Product',
      description: 'Product for API tests',
      price: 29.99,
      stock: 15,
      category: 'API Test'
    });
    
    productId = product._id.toString();
  });
  
  describe('Authentication API', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/api/users/signup')
        .send({
          firstName: 'New',
          lastName: 'User',
          email: 'newuser@example.com',
          password: 'password123',
          role: 'user'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('_id');
          expect(res.body.email).to.equal('newuser@example.com');
          done();
        });
    });
    
    it('should login a user', (done) => {
      chai.request(app)
        .post('/api/users/login')
        .send({
          email: 'user@example.com',
          password: 'userpass'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          expect(res.body.user).to.have.property('email');
          expect(res.body.user.email).to.equal('user@example.com');
          done();
        });
    });
  });
  
  describe('Products API', () => {
    it('should get all products with authentication', (done) => {
      chai.request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.at.least(1);
          done();
        });
    });
    
    it('should create a product with admin authentication', (done) => {
      chai.request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New API Product',
          description: 'Created through API test',
          price: 39.99,
          stock: 25,
          category: 'API Created'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('product');
          expect(res.body.product.name).to.equal('New API Product');
          done();
        });
    });
    
    it('should get a product by ID', (done) => {
      chai.request(app)
        .get(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('_id');
          expect(res.body._id).to.equal(productId);
          done();
        });
    });
  });
  
  describe('Access Control', () => {
    it('should reject unauthenticated requests', (done) => {
      chai.request(app)
        .get('/api/products')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    
    it('should reject requests with invalid token', (done) => {
      chai.request(app)
        .get('/api/products')
        .set('Authorization', 'Bearer invalidtoken')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });
}); 