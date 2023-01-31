const router = require('express').Router();
const routerUsers = require('./users');
const routerCards = require('./cards');
const NotFound = require('../errors/NotFound');
const auth = require('../middlewares/auth');

router.use('/cards', auth, routerCards);
router.use('/users', auth, routerUsers);

router.use('*', auth, (req, res, next) => {
  next(new NotFound('Маршрут не найден'));
});
module.exports = router;
