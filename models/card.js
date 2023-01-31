const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./user');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    validate: { validator: (v) => validator.isURL(v) },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    default: {},
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('Cards', cardSchema);
