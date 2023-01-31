const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Users = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const AuthError = require('../errors/AuthError');
const NotFound = require('../errors/NotFound');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      name, about, avatar, email, password: hash,
    }))
    .then((newUser) => {
      if (!newUser) {
        return next(new NotFound('Пользователь не найден'));
      } return res.send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
        _id: newUser._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Введены ны некорректные данные'));
      } else if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      } next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (user == null) {
        return next(new NotFound('Пользователь не найден'));
      } return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  Users.findById(req.params.userId)
    .then((userId) => {
      if (userId == null) {
        throw new NotFound('Пользователь не найден');
      } return res.send({ data: userId });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(new NotFound('Пользователь не найден'));
      } return res.send({ data: updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(new NotFound('Пользователь не найден'));
      } return res.send({ data: updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  Users.findOne({ email }).select('+password')
    .then((user) => {
      if (user === null) {
        throw new AuthError('Неправильная почта или пароль');
      } return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильная почта или пароль');
          } const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          res.cookie('jwt', token, { maxAge: 3600000 * 7, httpOnly: true, sameSite: true }).send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          });
        });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getCurrentUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  login,
};
