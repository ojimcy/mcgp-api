const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { uploadImage } = require('./imageUpload.service');
const { getOrderById } = require('./order.service');
const { Payment } = require('../models');

const payForOrder = async (orderId, files) => {
  const PaymentModel = await Payment();
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  const proofUrl = await uploadImage(files.proof[0].path);

  order.paymentProof = proofUrl;
  order.isPaid = true;
  order.status = 'Paid';
  order.paidAt = new Date();
  await order.save();

  const payment = await PaymentModel.create({
    order: orderId,
    proof: proofUrl,
    status: 'Pending',
  });

  return payment;
};

module.exports = {
  payForOrder,
};
