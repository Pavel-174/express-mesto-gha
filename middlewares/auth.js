require('dotenv').config();
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Необходима авторизация'));
  } let token = authorization.replace('Bearer ', '');
  try {
    token = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  } req.user = token;
  return next();
};
