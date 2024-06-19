const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPaymentAccount = {
  body: Joi.object().keys({
    bank_transfer: Joi.object({
      accountNumber: Joi.string(),
      accountName: Joi.string(),
      bankName: Joi.string(),
    }),
    crypto: Joi.object({
      walletAddress: Joi.string(),
      symbol: Joi.string(),
      network: Joi.string(),
    }),
  }),
};

const getPaymentAccounts = {
  query: Joi.object().keys({
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
    sortBy: Joi.string(),
  }),
};

const getPaymentAccount = {
  params: Joi.object().keys({
    paymentAccountId: Joi.string().custom(objectId),
  }),
};

const updatePaymentAccount = {
  params: Joi.object().keys({
    paymentAccountId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      bank_transfer: Joi.object({
        accountNumber: Joi.string(),
        accountName: Joi.string(),
        bankName: Joi.string(),
      }),
      crypto: Joi.object({
        walletAddress: Joi.string(),
        symbol: Joi.string(),
        network: Joi.string(),
      }),
    })
    .min(1),
};

const deletePaymentAccount = {
  params: Joi.object().keys({
    paymentAccountId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPaymentAccount,
  getPaymentAccounts,
  getPaymentAccount,
  updatePaymentAccount,
  deletePaymentAccount,
};
