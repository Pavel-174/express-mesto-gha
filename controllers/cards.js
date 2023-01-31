const Cards = require('../models/card');
const { ValidationError, NotFound, ForbiddenError } = require('../errors/index');

const getCards = (req, res, next) => {
  Cards.find({})
    .then((card) => res.status(200).send(card))
    .catch(next);
};

const createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;

  Cards.create({
    name,
    link,
    owner,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки.');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { _id } = req.params;
  const owner = req.user._id;
  Cards.findById(_id)
    .orFail(new NotFound('Карточка с указанным id не найдена.'))
    .then((card) => {
      if (card.owner.toString() === owner) {
        Cards.findByIdAndDelete(_id)
          .then((item) => res.status(200).send(item))
          .catch(next);
      } else {
        throw new ForbiddenError('Отсутствуют права на уделение карточки.');
      }
      return res.status(200).send({ message: 'Карточка удалена.' });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { _id } = req.params;
  const owner = req.user._id;
  Cards.findByIdAndUpdate(
    _id,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .orFail(new NotFound('Карточка с указанным id не найдена.'))
    .then((card) => res.status(200).send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { _id } = req.params;
  const owner = req.user._id;
  Cards.findByIdAndUpdate(
    _id,
    { $pull: { likes: owner } },
    { new: true },
  )
    .orFail(new NotFound('Карточка с указанным id не найдена.'))
    .then((card) => res.status(200).send(card))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
