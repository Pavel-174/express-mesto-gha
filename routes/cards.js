// const router = require('express').Router();
// const {
//   getCards,
//   createCard,
//   deleteCard,
//   likeCard,
//   dislikeCard,
// } = require('../controllers/cards');
// const {
//   validationCreateCard,
//   validationCardId,
// } = require('../middlewares/validations');

// router.get('/', getCards);
// router.post('/', validationCreateCard, createCard);
// router.delete('/:cardId', validationCardId, deleteCard);
// router.put('/:cardId/likes', validationCardId, likeCard);
// router.delete('/:cardId/likes', validationCardId, dislikeCard);

// module.exports = router;
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required()
      .regex(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
  }),
}), createCard);

router.get('/', getCards);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
