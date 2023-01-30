const { ConflictError } = require('./ConflictError');
const { ForbiddenError } = require('./ForbiddenError');
const { NotFoundError } = require('./NotFoundError');
const { AuthError } = require('./AuthError');
const { ValidationError } = require('./ValidationError');

module.exports = {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  AuthError,
  ValidationError,
};
