/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { Order, Advert } = require('../models');
const ApiError = require('../utils/ApiError');
const SYSTEM_CONFIG = require('../constants/systemConfig');

/**
 * Create an order
 * @param {Object} orderBody
 * @param {ObjectId} buyerId
 * @returns {Promise<Order>}
 */
const createOrder = async (orderBody, buyerId) => {
  const AdvertModel = await Advert();
  const OrderModel = await Order();
  const advert = await AdvertModel.findById(orderBody.product);
  if (!advert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Advert not found');
  }

  const orderData = {
    ...orderBody,
    buyer: buyerId,
    seller: advert.createdBy,
    amount: advert.price,
  };

  if (advert.type === 'Service') {
    orderData.serviceFee = SYSTEM_CONFIG.SYSTEM_FEE;
  }

  const order = await OrderModel.create(orderData);
  return order;
};

/**
 * Get order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (id) => {
  const OrderModel = await Order();
  return OrderModel.findById(id).populate('product buyer seller');
};

/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
  const OrderModel = await Order();
  const orders = await OrderModel.paginate(filter, options);
  return orders;
};

/**
 * Acknowledge payment
 * @param {ObjectId} orderId
 * @param {boolean} isPaymentReceived
 * @returns {Promise<Order>}
 */
const acknowledgePayment = async (orderId, isPaymentReceived) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  order.paymentStatus = isPaymentReceived ? 'Completed' : 'Failed';
  await order.save();
  return order;
};

/**
 * Release product
 * @param {ObjectId} orderId
 * @param {ObjectId} sellerId
 * @returns {Promise<Order>}
 */
const releaseProduct = async (orderId, sellerId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  if (order.seller.toString() !== sellerId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to release this product');
  }
  order.status = 'Released';
  await order.save();
  return order;
};

/**
 * Complete order
 * @param {ObjectId} orderId
 * @returns {Promise<Order>}
 */
const completeOrder = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  if (order.status !== 'Released') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order must be released before it can be completed');
  }
  order.status = 'Completed';
  await order.save();
  return order;
};

module.exports = {
  createOrder,
  getOrderById,
  queryOrders,
  acknowledgePayment,
  releaseProduct,
  completeOrder,
};
