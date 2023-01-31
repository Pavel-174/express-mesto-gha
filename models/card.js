const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');
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
    validate: {
      validator: (url) => isUrl(url),
      message: 'Некорректный адрес URL',
    },
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

module.exports = mongoose.model('Card', cardSchema);
