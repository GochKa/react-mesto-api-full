require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const { JWT_SECRET_KEY = 'test' } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  const createUser = (hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  });
  bcrypt
    .hash(password, 10)
    .then((hash) => createUser(hash))
    .then((user) => {
      const { _id } = user;
      res.send({
        _id,
        name,
        about,
        avatar,
        email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким EMAIL уже зарегистрирован'));
      }
      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.patchProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then((user) => res.send({ _id: user._id, name, about }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ _id: user._id, avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создать токен
      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById({ _id })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Некорректный id пользователя'));
      }
      return res.send(user);
    })
    .catch(next);
};
