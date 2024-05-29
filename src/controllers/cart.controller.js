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

const removeItemFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const cart = await cartService.removeItemFromCart(userId, productId);
  res.status(httpStatus.OK).send(cart);
};

const clearCart = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const cart = await cartService.clearCart(userId);
  res.status(httpStatus.OK).send(cart);
});

const increaseQuantity = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const cart = await cartService.increaseQuantity(userId, productId);
  res.status(httpStatus.OK).json(cart);
});

const decreaseQuantity = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const cart = await cartService.decreaseQuantity(userId, productId);
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
