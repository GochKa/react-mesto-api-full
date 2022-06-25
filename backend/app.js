require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
// const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFound = require('./errors/NotFound');

const { PORT = 3006 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
// app.use(cookieParser());
app.use(requestLogger);
const allowedCors = [
  'http://localhost:3006',
  'https://localhost:3006',
  'http://localhost:3000',
  'https://localhost:3000',
  'https://mestogram.gocha.nomoreparties.sbs',
  'http://mestogram.gocha.nomoreparties.sbs',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});

app.post('/sign-in', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/sign-up', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: Joi.string().custom((value, helpers) => {
      if (/^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
  }),
}), createUser);
app.use(auth);
app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('*', auth, (req, res, next) => {
  next(new NotFound('Страница с таким url не найдена.'));
});

app.use(errorLogger);
app.use(errors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use((err, _, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  res.status(500).send({ message: 'Ошибка по умолчанию.' });
  next();
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
