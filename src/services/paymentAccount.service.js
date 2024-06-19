const httpStatus = require('http-status');
const { PaymentAccount } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a payment method
 * @param {Object} paymentAccountBody
 * @returns {Promise<PaymentAccount>}
 */
const createPaymentAccount = async (paymentAccountBody) => {
  const paymentAccountModel = await PaymentAccount();
  return paymentAccountModel.create(paymentAccountBody);
};

/**
 * Query for payment methods
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryPaymentAccounts = async (filter, options) => {
  const paymentAccountModel = await PaymentAccount();
  return paymentAccountModel.paginate(filter, options);
};

/**
 * Get payment method by id
 * @param {ObjectId} id
 * @returns {Promise<PaymentAccount>}
 */
const getPaymentAccountById = async (id) => {
  const paymentAccountModel = await PaymentAccount();
  return paymentAccountModel.findById(id);
};

/**
 * Update payment method by id
 * @param {ObjectId} paymentAccountId
 * @param {Object} updateBody
 * @returns {Promise<PaymentAccount>}
 */
const updatePaymentAccountById = async (paymentAccountId, updateBody) => {
  const paymentAccount = await getPaymentAccountById(paymentAccountId);
  if (!paymentAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment method not found');
  }
  Object.assign(paymentAccount, updateBody);
  await paymentAccount.save();
  return paymentAccount;
};

/**
 * Delete payment method by id
 * @param {ObjectId} paymentAccountId
 * @returns {Promise<PaymentAccount>}
 */
const deletePaymentAccountById = async (paymentAccountId) => {
  const paymentAccount = await getPaymentAccountById(paymentAccountId);
  if (!paymentAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment method not found');
  }
  await paymentAccount.remove();
  return paymentAccount;
};

module.exports = {
  createPaymentAccount,
  queryPaymentAccounts,
  getPaymentAccountById,
  updatePaymentAccountById,
  deletePaymentAccountById,
};
