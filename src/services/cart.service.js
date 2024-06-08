const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Cart } = require('../models');
const { getProduct } = require('./advert.service');

// Helper function for parameter validation
const validateCartParams = (userId, productId, quantity) => {
  if (!userId || !productId || quantity == null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'userId, productId, and quantity are required');
  }
  if (quantity <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Quantity must be a positive number');
  }
};

/**
 * Add an item to the cart
 * @param {ObjectId} userId - The ID of the user whose cart is being modified
 * @param {ObjectId} productId - The ID of the product being added
 * @param {number} quantity - quantity of the item being added to the cart
 * @returns {Promise<Cart>} - The updated cart
 */
const addToCart = async (userId, productId, quantity) => {
  const CartModel = await Cart();

  validateCartParams(userId, productId, quantity);

  // Check if the product already exists in the user's cart
  const existingCartItem = await CartModel.findOne({ userId, productId });
  if (existingCartItem) {
    // If the product already exists, update the quantity
    existingCartItem.quantity += quantity;
    await existingCartItem.save();
    return existingCartItem;
  }

  const product = await getProduct(productId);
  // If the product doesn't exist, create a new cart item
  const newCartItem = new CartModel({
    userId,
    productId,
    quantity,
    title: product.title,
    price: product.price,
    image: product.images[0],
  });
  await newCartItem.save();
  return newCartItem;
};

/**
 * Get cart items for a user
 * @param {ObjectId} userId
 * @returns {Promise<Cart[]>}
 */
const getCartItems = async (userId) => {
  const CartModel = await Cart();
  const cartItems = await CartModel.find({ userId });
  return cartItems;
};

/**
 * Remove item from cart by productId
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} productId - Product ID
 * @returns {Promise<void>}
 */
const removeItemFromCart = async (userId, productId) => {
  const CartModel = await Cart();
  await CartModel.deleteOne({ userId, productId });
};

/**
 * Clear cart
 * @param {ObjectId} userId - User ID
 * @returns {Promise<void>}
 */
const clearCart = async (userId) => {
  const CartModel = await Cart();
  await CartModel.deleteMany({ userId });
};

/**
 * Increase the quantity of an item in the cart
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} productId - Product ID
 * @param {number} quantity - quantity to increase by
 * @returns {Promise<Cart>} - Updated cart
 */
const increaseQuantity = async (userId, productId, quantity) => {
  const CartModel = await Cart();

  validateCartParams(userId, productId, quantity);

  const cartItem = await CartModel.findOne({ userId, productId });
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found');
  }

  cartItem.quantity += quantity;
  await cartItem.save();

  return cartItem;
};

/**
 * Decrease the quantity of an item in the cart
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} productId - Product ID
 * @param {number} quantity - quantity to decrease by
 * @returns {Promise<Cart>} - Updated cart
 */
const decreaseQuantity = async (userId, productId, quantity) => {
  const CartModel = await Cart();

  validateCartParams(userId, productId, quantity);

  const cartItem = await CartModel.findOne({ userId, productId });
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found');
  }

  cartItem.quantity -= quantity;
  if (cartItem.quantity <= 0) {
    await CartModel.deleteOne({ userId, productId });
    return null;
  }

  await cartItem.save();
  return cartItem;
};

module.exports = {
  addToCart,
  getCartItems,
  removeItemFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
};
