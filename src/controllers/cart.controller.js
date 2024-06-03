const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');

const addToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;
  const cart = await cartService.addToCart(userId, productId, quantity);
  res.status(httpStatus.OK).json(cart);
});

const getCart = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const cart = await cartService.getCartItems(userId);
  res.status(httpStatus.OK).json(cart);
});

const removeItemFromCart = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  await cartService.removeItemFromCart(userId, productId);
  res.status(httpStatus.OK).json({ message: 'Item removed from cart' });
});

const clearCart = catchAsync(async (req, res) => {
  const userId = req.user._id;
  await cartService.clearCart(userId);
  res.status(httpStatus.OK).json({ message: 'Cart cleared' });
});

const increaseQuantity = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id;
  const cart = await cartService.increaseQuantity(userId, productId, quantity);
  res.status(httpStatus.OK).json(cart);
});

const decreaseQuantity = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id;
  const cart = await cartService.decreaseQuantity(userId, productId, quantity);
  res.status(httpStatus.OK).json(cart);
});

module.exports = {
  addToCart,
  getCart,
  removeItemFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
};
