const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Cart } = require('../models');
const { getProduct } = require('./product.service');

/**
 * Add an item to the cart
 * @param {ObjectId} userId - The ID of the user whose cart is being modified
 * @param {ObjectId} productId - The ID of the product being added
 * @param {Object} quantity - quantity of the item being added to the cart
 * @returns {Promise<Cart>} - The updated cart
 */
const addToCart = async (userId, productId, quantity) => {
  const CartModel = await Cart();

  // Check if userId and productId are provided
  if (!userId || !productId || !quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'userId, productId, and quantity are required');
  }

  if (quantity <= 0) {
    throw new Error('Quantity must be a positive number');
  }

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
 * @returns {Promise<Cart>}
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
  // Fetch Cart model
  const CartModel = await Cart();

  // Find and remove the cart item
  await CartModel.deleteOne({ userId, productId });
};

/**
 * Clear cart
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Cart>} - Updated cart
 */
const clearCart = async (userId) => {
  // Fetch Cart model
  const cartModel = await Cart();
  // Find cart by userId
  const cart = await cartModel.findOne({ userId });
  // If cart doesn't exist, throw error
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }

  // Delete all documents in the cart
  await cartModel.deleteMany({ userId });
};

/**
 * Increase the quantity of an item in the cart
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} productId - Product ID
 * @param {Object} quantity - quantity to increase by
 * @returns {Promise<Cart>} - Updated cart
 */
const increaseQuantity = async (userId, productId, quantity) => {
  const CartModel = await Cart();

  // Check if userId, productId, and quantity are provided
  if (!userId || !productId || !quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'userId, productId, and quantity are required');
  }

  // Find the cart item
  const cartItem = await CartModel.findOne({ userId, productId });
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found');
  }

  // Increase the quantity
  cartItem.quantity += quantity;
  await cartItem.save();

  return cartItem;
};

/**
 * Decrease the quantity of an item in the cart
 * @param {ObjectId} userId - User ID
 * @param {ObjectId} productId - Product ID
 * @param {Object} quantity - quantity to Decrease by
 * @returns {Promise<Cart>} - Updated cart
 */
const decreaseQuantity = async (userId, productId, quantity) => {
  const CartModel = await Cart();

  // Check if userId, productId, and quantity are provided
  if (!userId || !productId || !quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'userId, productId, and quantity are required');
  }

  // Find the cart item
  const cartItem = await CartModel.findOne({ userId, productId });
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found');
  }

  // Decrease the quantity
  cartItem.quantity -= quantity;
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
