const { ServerError } = require('../errors/index');

function handleError(err, res, next) {
  const { statusCode = ServerError, message } = err;
  res.status(statusCode).send({ message: statusCode === ServerError ? 'На сервере произошла ошибка' : message });
  next();
}

module.exports = handleError;
