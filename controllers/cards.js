const Cards = require('../models/card');
const { ValidationError, NotFound, ForbiddenError } = require('../errors/index');

const getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => {
      if (!cards) {
        return next(new NotFound('Объект не найден'));
      } return res.send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((newCard) => {
      if (!newCard) {
        return next(new NotFound('Объект не найден'));
      } return res.send({ data: newCard });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } next(err);
    });
};

const deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (card == null) {
        throw new NotFound('Объект не найден');
      } else if (String(card.owner) !== req.user._id) {
        throw new ForbiddenError('Доступ ограничен');
      } return Cards.findByIdAndRemove(req.params.cardId)
        .then((removedCard) => {
          res.send({ data: removedCard });
        });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (cards == null) {
        throw new NotFound('Объект не найден');
      } res.send({ data: cards });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cards) => {
      if (cards == null) {
        throw new NotFound('Объект не найден');
      } res.send({ data: cards });
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
