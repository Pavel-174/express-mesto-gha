const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const router = require('./routes/index');
const handelError = require('./middlewares/handelError');

const app = express();
app.use(cookieParser());
const { PORT = 3000 } = process.env;
const DATA_URL = 'mongodb://127.0.0.1:27017/mestodb';

mongoose
  .connect(DATA_URL)
  .then(() => {
    console.log(`App connected to database on ${DATA_URL}`);
  })
  .catch((err) => {
    console.log('Database connection error');
    console.error(err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.get('/signout', (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Выход' });
});

app.use(router);

app.use(errors());

app.use((err, req, res, next) => { handelError(err, res, next); });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
