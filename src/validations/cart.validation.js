const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addToCart = {
  body: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().integer().min(1).required(),
  }),
};

const removeItemFromCart = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};

const increaseQuantity = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    quantity: Joi.number().integer().min(1).required(),
  }),
};

const decreaseQuantity = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    quantity: Joi.number().integer().min(1).required(),
  }),
};

module.exports = {
  addToCart,
  removeItemFromCart,
  increaseQuantity,
  decreaseQuantity,
};
