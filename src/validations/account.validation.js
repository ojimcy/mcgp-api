const Joi = require('joi');

const getAccount = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const deposit = {
  body: Joi.object().keys({
    amount: Joi.number().required().min(0),
    description: Joi.string().required(),
  }),
};

const requestWithdrawal = {
  body: Joi.object().keys({
    paymentMethod: Joi.string().valid('fiat', 'crypto').required(),
    paymentDetails: Joi.object()
      .keys({
        type: Joi.string().required(),
        accountNumber: Joi.string(),
        accountName: Joi.string(),
        bankName: Joi.string(),
        walletAddress: Joi.string(),
        symbol: Joi.string(),
        network: Joi.string(),
      })
      .required(),
    amount: Joi.number().required().min(0),
  }),
};

const completeWithdrawal = {
  body: Joi.object().keys({
    withdrawalRequestId: Joi.string().required(),
    isCompleted: Joi.boolean().required(),
  }),
};

const updateAccount = {
  body: Joi.object().keys({
    paymentDetails: Joi.object()
      .keys({
        type: Joi.string().required(),
        accountNumber: Joi.string(),
        accountName: Joi.string(),
        bankName: Joi.string(),
        walletAddress: Joi.string(),
        symbol: Joi.string(),
        network: Joi.string(),
      })
      .required(),
  }),
};

module.exports = {
  getAccount,
  deposit,
  requestWithdrawal,
  completeWithdrawal,
  updateAccount,
};
