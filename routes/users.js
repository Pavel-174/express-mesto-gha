const routerUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getCurrentUser,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

routerUser.get('/', getUsers);
routerUser.get('/me', getCurrentUser);
routerUser.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);

routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

routerUser.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
  }),
}), updateAvatar);

module.exports = routerUser;
