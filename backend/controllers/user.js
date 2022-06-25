// Импорт необходимых пакетов
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Импорт ошибок
const { JWT_SECRET, NODE_ENV } = process.env;
const InvalidRequest = require('../errors/InvalidRequest');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/conflict');

// Создание нового пользователя
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(200)
      .send({
        data: {
          name,
          about,
          avatar,
          email,
        },
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidRequest('не передан email или пароль');
      }
      if (err.code === 11000) {
        throw new Conflict('такой email уже занят');
      }
      next(err);
    });
};

// Логин
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
// Информация о выбраном пользователе
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};
// Нобор всех зарегестрированных пользователей
const getUsers = (_, res, next) => {
  User.find({})
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

// Информация пользователя с указанным _id
const getUser = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFound('пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new InvalidRequest('некорректный id при создании пользователя');
      }
      next(err);
    });
};

// Обновление информации о пользователе
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        throw new NotFound('пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidRequest('переданы некорректные данные при создании пользователя');
      }
      next(err);
    });
};

// Обновление автара пользователя
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        throw new NotFound('пользователь по указанному id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidRequest('переданы некорректные данные при обновлении аватара');
      }
      next(err);
    });
};

// Экспорт модулей
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
