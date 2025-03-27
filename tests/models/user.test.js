const chai = require('chai');
const expect = chai.expect;
const User = require('../../src/models/User');
require('../config');

describe('User Model Test', () => {
  it('should create a new user', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    };
    
    const user = new User(userData);
    const savedUser = await user.save();
    
    expect(savedUser).to.have.property('_id');
    expect(savedUser.email).to.equal(userData.email);
    expect(savedUser.firstName).to.equal(userData.firstName);
    expect(savedUser.role).to.equal('user');
  });
  
  it('should fail for user without required fields', async () => {
    const user = new User({
      firstName: 'Incomplete'
    });
    
    let error = null;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    
    expect(error).to.exist;
    expect(error.errors.lastName).to.exist;
    expect(error.errors.email).to.exist;
    expect(error.errors.password).to.exist;
  });

  it('should not allow duplicate emails', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'duplicate@example.com',
      password: 'password123',
      role: 'user'
    };
    
    await new User(userData).save();
    
    const duplicateUser = new User(userData);
    let error = null;
    try {
      await duplicateUser.save();
    } catch (err) {
      error = err;
    }
    
    expect(error).to.exist;
  });
}); 