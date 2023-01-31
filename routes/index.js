const router = require('express').Router();
const routerUser = require('./users');
const routerCard = require('./cards');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/index');

router.use('/users', auth, routerUser);
router.use('/cards', auth, routerCard);

router.use((req, res, next) => {
  next(new NotFound('Запрашиваемая страница не существует'));
});

module.exports = router;
