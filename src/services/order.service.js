/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { Order } = require('../models');
const ApiError = require('../utils/ApiError');
// const SYSTEM_CONFIG = require('../constants/systemConfig');
const { getCartItems, clearCart } = require('./cart.service');
const { getAdById } = require('./advert.service');

/**
 * Create an order
 * @param {ObjectId} buyerId - The ID of the buyer
 * @returns {Promise<Order[]>} - The created orders
 */
const createOrder = async (orderBody, buyerId) => {
  const { deliveryAddress, paymentMethod } = orderBody;

  const OrderModel = await Order();
  const cartItems = await getCartItems(buyerId);

  if (cartItems.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }
  const orderItems = await Promise.all(
    cartItems.map(async (item) => {
      const advert = await getAdById(item.productId);
      if (!advert) {
        throw new ApiError(httpStatus.NOT_FOUND, `Advert not found`);
      }
      return {
        advert: item.productId,
        quantity: item.quantity,
        price: advert.price * item.quantity,
        seller: advert.createdBy,
      };
    })
  );
  const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

  const orderData = {
    product: orderItems,
    buyer: buyerId,
    amount: totalAmount,
    deliveryAddress,
    paymentMethod,
  };

  const order = await OrderModel.create(orderData);

  // Clear the cart after creating the order
  await clearCart(buyerId);

  return order;
};

/**
 * Get order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (id) => {
  const OrderModel = await Order();
  return OrderModel.findById(id).populate('product.advert');
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
 * Get orders by user ID
 * @param {ObjectId} userId - The ID of the user
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getOrdersByUser = async (userId, options) => {
  const OrderModel = await Order();
  const filter = { buyer: userId };
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
  getOrdersByUser,
  acknowledgePayment,
  releaseProduct,
  completeOrder,
};
