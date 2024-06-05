const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');
const pick = require('../utils/pick');

const createOrder = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const order = await orderService.createOrder(userId, req.body);
  res.status(httpStatus.CREATED).json(order);
});

const getOrdersByUserId = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const orders = await orderService.getOrdersByUserId(userId);
  res.status(httpStatus.OK).json(orders);
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'paymentMethod']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const orders = await orderService.getOrders(filter, options);
  res.status(httpStatus.OK).json(orders);
});

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrders,
};
