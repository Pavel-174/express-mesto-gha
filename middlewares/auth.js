require('dotenv').config();
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token == null) {
    return next(new Unauthorized('Требуется авторизация'));
  } let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new Unauthorized('Требуется авторизация'));
  } req.user = payload;
  return next();
};
