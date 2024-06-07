const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { orderService, paymentService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  const buyerId = req.user._id;
  const order = await orderService.createOrder(req.body, buyerId);
  res.status(httpStatus.CREATED).json(order);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  res.json(order);
});

const payForOrder = catchAsync(async (req, res) => {
  const payment = await paymentService.processPayment(req.params.orderId, req.body, req.files);
  res.status(httpStatus.OK).json(payment);
});

const acknowledgePayment = catchAsync(async (req, res) => {
  const order = await orderService.acknowledgePayment(req.params.orderId);
  res.status(httpStatus.OK).json(order);
});

const releaseProduct = catchAsync(async (req, res) => {
  const order = await orderService.releaseProduct(req.params.orderId, req.user.id);
  res.status(httpStatus.OK).json(order);
});

const completeOrder = catchAsync(async (req, res) => {
  const order = await orderService.completeOrder(req.params.orderId);
  res.status(httpStatus.OK).json(order);
});

module.exports = {
  createOrder,
  getOrder,
  payForOrder,
  acknowledgePayment,
  releaseProduct,
  completeOrder,
};
