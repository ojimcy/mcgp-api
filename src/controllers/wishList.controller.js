const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { wishListService } = require('../services');

const addToWishlist = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { advertId } = req.params;
  const wishlist = await wishListService.addToWishlist(userId, advertId);
  res.status(httpStatus.OK).json(wishlist);
});

const removeFromWishlist = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { advertId } = req.params;
  const wishlist = await wishListService.removeFromWishlist(userId, advertId);
  res.status(httpStatus.OK).json(wishlist);
});

const getWishlist = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const wishlist = await wishListService.getWishlist(userId);
  res.status(httpStatus.OK).json(wishlist);
});

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
