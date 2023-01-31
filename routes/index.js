const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFoundError');

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

router.use('*', auth, (req, res, next) => {
  next(new NotFound('Страницы не существует'));
});

module.exports = router;
