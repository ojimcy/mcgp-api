const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { orderService, paymentService } = require('../services');
const pick = require('../utils/pick');

const createOrder = catchAsync(async (req, res) => {
  const buyerId = req.user._id;
  const order = await orderService.createOrder(req.body, buyerId);
  res.status(httpStatus.CREATED).json(order);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  res.json(order);
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const ads = await orderService.queryOrders(filter, options);
  res.status(httpStatus.OK).json(ads);
});

const getMyOrders = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const orders = await orderService.getOrdersByUser(userId, options);
  res.status(httpStatus.OK).json(orders);
});

const payForOrder = catchAsync(async (req, res) => {
  const payment = await paymentService.payForOrder(req.params.orderId, req.body, req.files);
  res.status(httpStatus.OK).json(payment);
});

const acknowledgePayment = catchAsync(async (req, res) => {
  const order = await orderService.acknowledgePayment(req.params.orderId, req.body);
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
  getOrders,
  getMyOrders,
  payForOrder,
  acknowledgePayment,
  releaseProduct,
  completeOrder,
};
