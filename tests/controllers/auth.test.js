const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/User');
const { userSignUp, userLogin } = require('../../src/controllers/userController');
const expect = chai.expect;
require('../config');

chai.use(chaiHttp);

describe('Auth Controller Tests', () => {
  beforeEach(() => {
    // Create mock request and response objects
    this.req = {
      body: {},
      hashedPassword: null
    };
    
    this.res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
  });
  
  it('should create a new user during signup', async () => {
    this.req.body = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'user'
    };
    this.req.hashedPassword = await bcrypt.hash('password123', 10);
    
    await userSignUp(this.req, this.res);
    
    expect(this.res.status.calledWith(201)).to.be.true;
    expect(this.res.json.calledOnce).to.be.true;
    
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).to.exist;
    expect(user.firstName).to.equal('Test');
  });
  
  it('should log in an existing user and return token', async () => {
    // Create a test user first
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      firstName: 'Login',
      lastName: 'Test',
      email: 'login@example.com',
      password: hashedPassword,
      role: 'user'
    });
    
    this.req.body = {
      email: 'login@example.com',
      password: 'password123'
    };
    
    // Override JWT_SECRET for tests
    process.env.JWT_SECRET = 'testsecret';
    
    await userLogin(this.req, this.res);
    
    expect(this.res.json.calledOnce).to.be.true;
    const response = this.res.json.firstCall.args[0];
    expect(response).to.have.property('token');
    expect(response).to.have.property('user');
    expect(response.user.email).to.equal('login@example.com');
  });
  
  it('should reject login with wrong password', async () => {
    this.req.body = {
      email: 'login@example.com',
      password: 'wrongpassword'
    };
    
    await userLogin(this.req, this.res);
    
    expect(this.res.status.calledWith(400)).to.be.true;
    const response = this.res.json.firstCall.args[0];
    expect(response.message).to.equal('Invalid credentials');
  });
}); 