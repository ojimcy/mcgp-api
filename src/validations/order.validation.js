const Joi = require('joi');
const { objectId } = require('./custom.validation');

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
        country: Joi.string().required(),
      })
      .required(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    type: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const payForOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    amount: Joi.number().required(),
    method: Joi.string().valid('Bank Transfer', 'Crypto Wallet').required(),
  }),
};

const acknowledgePayment = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    isPaymentRecieved: Joi.boolean().required(),
  }),
};

const releaseProduct = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
  }),
};

const completeOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createOrder,
  getOrder,
  payForOrder,
  acknowledgePayment,
  releaseProduct,
  completeOrder,
  getOrders,
};
