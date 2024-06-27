const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  getAccountByUserId,
  makeWithdrawalRequest,
  handleWithdrawalCompletion,
  updateAccountDetails,
} = require('../services/account.service');

/**
 * Get account details by user ID
 */
const getAccount = catchAsync(async (req, res) => {
  const account = await getAccountByUserId(req.user._id);
  res.status(httpStatus.OK).send(account);
});

/**
 * Get account details by user ID
 */
const getUserAccount = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const account = await getAccountByUserId(userId);
  res.status(httpStatus.OK).send(account);
});

/**
 * Make a withdrawal request
 */
const requestWithdrawal = catchAsync(async (req, res) => {
  const account = await makeWithdrawalRequest(req.user._id, req.body);
  res.status(httpStatus.OK).send(account);
});

/**
 * Handle withdrawal completion
 */
const completeWithdrawal = catchAsync(async (req, res) => {
  const { withdrawalRequestId, isCompleted } = req.body;
  const account = await handleWithdrawalCompletion(req.user._id, withdrawalRequestId, isCompleted);
  res.status(httpStatus.OK).send(account);
});

/**
 * Update account details
 */
const updateAccount = catchAsync(async (req, res) => {
  const account = await updateAccountDetails(req.user._id, req.body);
  res.status(httpStatus.OK).send(account);
});

module.exports = {
  getAccount,
  requestWithdrawal,
  completeWithdrawal,
  updateAccount,
  getUserAccount,
};
