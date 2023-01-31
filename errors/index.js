const { ConflictError } = require('./ConflictError');
const { ForbiddenError } = require('./ForbiddenError');
const { NotFound } = require('./NotFound');
const { AuthError } = require('./AuthError');
const { ValidationError } = require('./ValidationError');
const { ServerError } = require('./ServerError');

module.exports = {
  ConflictError,
  ForbiddenError,
  NotFound,
  AuthError,
  ValidationError,
  ServerError,
};
