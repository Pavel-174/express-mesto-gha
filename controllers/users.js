const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NotFound, ValidationError, ConflictError, AuthError,
} = require('../errors/index');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { _id } = req.params;
  User.findById(_id)
    .orFail(new NotFound('Пользователь по указанному id не найден.'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((mail) => {
      if (mail) {
        throw new ConflictError('Пользователь с таким email уже существует.');
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          }))
          .then((user) => res.status(200).send(user))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              throw new ValidationError('Переданы некорректные данные при создании пользователя.');
            }
          })
          .catch(next);
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, {
    name,
    about,
  }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь по указанному id не найден.'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при обновлении профиля.');
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const {
    avatar,
  } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, {
    avatar,
  }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь по указанному id не найден.'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при обновлении аватара.');
      }
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const owner = req.user._id;
  User.findById(owner)
    .orFail(new NotFound('Пользователь по указанному id не найден.'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
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
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  getCurrentUser,
  login,
};
