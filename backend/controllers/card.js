const Card = require('../models/card');

// Импорт ошибок
const InvalidRequest = require('../errors/InvalidRequest');
const NotFound = require('../errors/NotFound');
const ForbiddenError = require('../errors/ForbiddenError');

// Получить весь набор карточек
const getCards = (__, res, next) => {
  Card.find({})
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      next(err);
    });
};

// Создать новую карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidRequest('переданы некорректные данные при создании карточки');
      }
      next(err);
    });
};

// Удаление карточки
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('карточка не найдена');
      }
      if (req.user._id === card.owner.toString()) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => {
            res.send({ data: card });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new InvalidRequest('некорректный id');
            }
            next(err);
          });
        return;
      }
      throw new ForbiddenError('невозможно удалить карту других пользователей');
    })
    .catch((err) => next(err));
};

// Лайк карточки
const addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('передан несуществующий id карточки');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidRequest('некорректный id');
      }
      next(err);
    });
};

// Удаление карточки
const removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('передан несуществующий id карточки');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidRequest('некорректный id');
      }
      next(err);
    });
};

// Экспорт модулей
module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
