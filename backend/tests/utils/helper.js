const supertest = require('supertest');
const app = require('../../src/index');
const jwt = require('jsonwebtoken');

const request = () => supertest(app);

const getAuthHeader = () => {
  const token = jwt.sign({}, process.env.JWT_SECRET); // any valid signature
  return { Authorization: `Bearer ${token}` };
};

module.exports = { request, getAuthHeader };
