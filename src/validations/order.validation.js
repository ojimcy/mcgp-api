const Joi = require('joi');

const createOrder = {
  body: Joi.object().keys({
    paymentMethod: Joi.string().valid('bank_transfer', 'crypto').required(),
    deliveryAddress: Joi.object()
      .keys({
        fullName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
      })
      .required(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    status: Joi.string(),
    paymentMethod: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createOrder,
  getOrders,
};
