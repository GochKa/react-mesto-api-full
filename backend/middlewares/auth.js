const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
require('dotenv').config();

const { JWT_SECRET_KEY = 'test' } = process.env;

module.exports = (req, res, next) => {
  const tmpAuthorization = req.headers.authorization;
  const jwtAuthorization = tmpAuthorization.split(' ')[1];
  const cookieAuthorization = req.cookies.jwt;
  console.log('cookieAuthorization =');
  console.log(req);
  if (!cookieAuthorization && !jwtAuthorization) {
    return next(new AuthorizationError('Ошибка авторизации'));
  }
  let payload;
  try {
    if (cookieAuthorization != null) payload = jwt.verify(cookieAuthorization, JWT_SECRET_KEY);
    console.log(jwt.verify);
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
