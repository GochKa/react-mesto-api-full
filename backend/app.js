// Импорт необходимых пакетов
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
// Импорт необходимых модулей
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found');
const regEx = require('./utils/reg');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// Пожкдючение к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb');

// Порт и подулючение приложения к express
const { PORT = 3005 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
// CORS
const allowedCors = [
  'http://mestogram.gocha.nomoreparties.sbs',
  'https://mestogram.gocha.nomoreparties.sbs',
  'http://localhost:3005',
  'https://localhost:3005',
];
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  next();
};

app.use(cors(allowedCors));

// Логин
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// Регистрациииия
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regEx),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// Подключение авторизации
app.use(auth);

// Основные страницы, защищенные авторизацией
app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/cards'));

// Переход по несуществующему пути
app.use('*', auth, (_, __, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

app.use(errorLogger);

app.use(errors());

// Контроль несуществующей ошибки
app.use((err, _, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

// Запуск сервера
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
