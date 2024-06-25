const mongoose = require('mongoose');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Account, Transaction } = require('../models');

/**
 * Get account by user ID
 * @param {ObjectId} userId - The ID of the user
 * @returns {Promise<Account>}
 */
const getAccountByUserId = async (userId) => {
  const account = await Account.findOne({ user: userId });
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  return account;
};

/**
 * Make a withdrawal request
 * @param {ObjectId} userId - The ID of the user making the request
 * @param {Object} requestBody - The withdrawal request details
 * @returns {Promise<Object>} The saved transaction and updated account
 */
const makeWithdrawalRequest = async (userId, requestBody) => {
  const { paymentMethod, paymentDetails, amount } = requestBody;

  const TransactionModel = await Transaction();
  const AccountModel = await Account();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const account = await AccountModel.findOne({ user: userId }).session(session);
    if (!account) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
    }

    if (account.balance < amount) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }

    const transactionData = {
      user: userId,
      type: 'debit',
      amount,
      description: `Withdrawal request`,
      status: 'pending',
      paymentMethod,
    };

    if (paymentMethod === 'fiat') {
      transactionData.accountName = paymentDetails.accountName;
      transactionData.accountNumber = paymentDetails.accountNumber;
      transactionData.bankName = paymentDetails.bankName;
    } else if (paymentMethod === 'crypto') {
      transactionData.walletAddress = paymentDetails.walletAddress;
      transactionData.symbol = paymentDetails.symbol;
      transactionData.network = paymentDetails.network;
    }

    const transaction = new TransactionModel(transactionData);
    await transaction.save({ session });

    account.balance -= amount;
    await account.save({ session });

    await session.commitTransaction();

    return { transaction, account };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Complete a withdrawal request
 * @param {ObjectId} adminId - The ID of the admin completing the request
 * @param {ObjectId} withdrawalRequestId - The ID of the withdrawal request
 * @returns {Promise<Object>} The updated transaction and account
 */
const handleWithdrawalCompletion = async (adminId, withdrawalRequestId, isCompleted) => {
  const TransactionModel = await Transaction();
  const AccountModel = await Account();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transaction = await TransactionModel.findById(withdrawalRequestId).session(session);
    if (!transaction) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
    }

    if (transaction.status !== 'pending') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No pending withdrawal');
    }

    transaction.status = isCompleted ? 'completed' : 'failed';
    transaction.completedBy = adminId;
    transaction.completedAt = new Date();
    await transaction.save({ session });

    if (!isCompleted) {
      // If not completed, add the amount back to the user's balance
      const account = await AccountModel.findOne({ user: transaction.user }).session(session);
      if (!account) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
      }

      account.balance += transaction.amount;
      await account.save({ session });
    }

    await session.commitTransaction();

    return transaction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Update account details
 * @param {ObjectId} userId
 * @param {Object} updateData
 * @returns {Promise<Account>}
 */
const updateAccountDetails = async (userId, updateData) => {
  const AccountModel = await Account();
  const account = await AccountModel.findOne({ user: userId });
  if (!account) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }

  if (updateData.withdrawalDetails) {
    account.withdrawalDetails = updateData.withdrawalDetails;
  }

  await account.save();
  return account;
};

module.exports = {
  getAccountByUserId,
  makeWithdrawalRequest,
  handleWithdrawalCompletion,
  updateAccountDetails,
};
