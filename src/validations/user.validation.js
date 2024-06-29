const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().optional().email(),
    phoneNumber: Joi.string().optional(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    country: Joi.string().required(),
    role: Joi.string(),
    profilePicture: Joi.string(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().optional().email(),
      password: Joi.string().optional().custom(password),
      name: Joi.string().optional(),
      country: Joi.string().optional(),
      role: Joi.string().optional(),
      phoneNumber: Joi.string().optional(),
      profilePicture: Joi.string().optional(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getMyProfile = {
  query: Joi.object().keys({
    name: Joi.string(),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    email: Joi.string().optional().email(),
    name: Joi.string().optional(),
    country: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
    confirmPassword: Joi.string().required().custom(password),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateProfile,
  resetPassword,
};
