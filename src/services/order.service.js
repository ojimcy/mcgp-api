const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Order, Product, Cart } = require('../models');
const { uploadImage } = require('./imageUpload.service');

/**
 * Create an order
 * @param {ObjectId} userId - The ID of the user creating the order
 * @param {Object} orderBody - The order details
 * @returns {Promise<Order>}
 */
const createOrder = async (userId, orderBody) => {
  const OrderModel = await Order();
  const ProductModel = await Product();
  const CartModel = await Cart();

  const { paymentMethod, deliveryAddress } = orderBody;

  // Fetch cart items for the user
  const cartItems = await CartModel.find({ userId });
  if (cartItems.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Your cart is empty');
  }

  // Calculate total amount and validate product availability
  const orderItems = await Promise.all(
    cartItems.map(async (cartItem) => {
      const product = await ProductModel.findById(cartItem.productId);
      if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
      }
      if (product.stock < cartItem.quantity) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Product out of stock');
      }
      const total = product.price * cartItem.quantity;
      return {
        productId: product._id,
        title: product.title,
        quantity: cartItem.quantity,
        price: product.price,
        total,
      };
    })
  );

  const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);

  const order = new OrderModel({
    userId,
    createdBy: userId,
    items: orderItems,
    totalAmount,
    paymentMethod,
    deliveryAddress: {
      fullName: deliveryAddress.fullName,
      phoneNumber: deliveryAddress.phoneNumber,
      address: deliveryAddress.address,
      state: deliveryAddress.state,
      city: deliveryAddress.city,
    },
  });

  await order.save();

  // Update product stock
  await Promise.all(
    cartItems.map((cartItem) => ProductModel.updateOne({ _id: cartItem.productId }, { $inc: { stock: -cartItem.quantity } }))
  );

  // Clear user's cart
  await CartModel.deleteMany({ userId });

  return order;
};

/**
 * Get orders by user ID
 * @param {ObjectId} userId
 * @returns {Promise<Order[]>}
 */
const getOrdersByUserId = async (userId) => {
  const OrderModel = await Order();
  return OrderModel.find({ userId });
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getOrders = async (filter, options) => {
  const OrderModel = await Order();
  const orders = await OrderModel.paginate(filter, options);
  return orders;
};

const getOrderById = async (orderId) => {
  const OrderModel = await Order();
  const order = await OrderModel.findById(orderId);
  return order;
};

/**
 * Upload proof of payment
 * @param {ObjectId} orderId
 * @param {String} proofOfPaymentUrl
 * @returns {Promise<Order>}
 */
const uploadProofOfPayment = async (orderId, proofOfPaymentUrl) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  const proofOfPayment = await uploadImage(proofOfPaymentUrl);

  order.proofOfPayment = proofOfPayment;
  order.status = 'paid';
  order.isPaid = true;
  order.paidAt = new Date();

  await order.save();
  return order;
};

/**
 * Confirm payment by seller
 * @param {ObjectId} orderId
 * @returns {Promise<Order>}
 */
const confirmPaymentBySeller = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (order.status !== 'paid') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order is not marked as paid');
  }

  order.isPaymentConfirmed = true;

  await order.save();
  return order;
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getOrders,
  uploadProofOfPayment,
  confirmPaymentBySeller,
};
