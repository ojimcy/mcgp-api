const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { paymentAccountService } = require('../services');

const createPaymentAccount = catchAsync(async (req, res) => {
  const paymentAccount = await paymentAccountService.createPaymentAccount(req.body);
  res.status(httpStatus.CREATED).json(paymentAccount);
});

const getPaymentAccounts = catchAsync(async (req, res) => {
  const result = await paymentAccountService.queryPaymentAccounts();
  res.status(httpStatus.OK).json(result);
});

const getPaymentAccount = catchAsync(async (req, res) => {
  const paymentAccount = await paymentAccountService.getPaymentAccountById(req.params.paymentAccountId);
  res.status(httpStatus.OK).json(paymentAccount);
});

const updatePaymentAccount = catchAsync(async (req, res) => {
  const paymentAccount = await paymentAccountService.updatePaymentAccountById(req.params.paymentAccountId, req.body);
  res.status(httpStatus.OK).json(paymentAccount);
});

const deletePaymentAccount = catchAsync(async (req, res) => {
  await paymentAccountService.deletePaymentAccountById(req.params.paymentAccountId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPaymentAccount,
  getPaymentAccounts,
  getPaymentAccount,
  updatePaymentAccount,
  deletePaymentAccount,
};
