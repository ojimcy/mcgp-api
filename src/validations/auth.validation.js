const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().optional().email(),
    password: Joi.string().required().custom(password),
    lastName: Joi.string().required(),
    country: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    otp: Joi.string(),
  }),
};

const loginUser = {
  body: Joi.object().keys({
    identifier: Joi.string().required(),
    password: Joi.string().required(),
    otp: Joi.string(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    otp: Joi.string().required(),
  }),
  body: Joi.object().keys({
    newPassword: Joi.string().required().custom(password),
    confirmNewPassword: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    otp: Joi.string(),
  }),
};

module.exports = {
  register,
  login,
  loginUser,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
