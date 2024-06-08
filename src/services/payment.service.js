const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { uploadImage } = require('./imageUpload.service');
const PAYMENT_ACCOUNTS = require('../constants/paymentAccounts');
const { getOrderById } = require('./order.service');
const { Payment } = require('../models');

const payForOrder = async (orderId, paymentBody, files) => {
  const PaymentModel = await Payment();
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  let accountDetails;
  if (paymentBody.method === 'bank_transfer') {
    accountDetails = PAYMENT_ACCOUNTS.BANK_TRANSFER;
  } else if (paymentBody.method === 'crypto') {
    accountDetails = PAYMENT_ACCOUNTS.CRYPTO_WALLET;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid payment method');
  }

  const proofUrl = files.proof ? await uploadImage(files.proof[0].path) : null;

  order.paymentProof = proofUrl;
  order.paymentMethod = paymentBody.method;
  order.isPaid = true;
  order.status = 'Paid';
  order.paidAt = new Date();
  await order.save();

  const payment = await PaymentModel.create({
    order: orderId,
    amount: paymentBody.amount,
    method: paymentBody.method,
    proof: proofUrl,
    status: 'Pending',
    accountDetails,
  });

  return payment;
};

module.exports = {
  payForOrder,
};
