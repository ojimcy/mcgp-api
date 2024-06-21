const httpStatus = require('http-status');
const { Wishlist } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Add an advert to the wishlist
 * @param {ObjectId} userId
 * @param {ObjectId} advertId
 * @returns {Promise<Wishlist>}
 */
const addToWishlist = async (userId, advertId) => {
  const wishlistModel = await Wishlist();
  let wishlist = await wishlistModel.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await wishlistModel.create({ user: userId, adverts: [advertId] });
  } else {
    if (wishlist.adverts.includes(advertId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Advert is already in the wishlist');
    }
    wishlist.adverts.push(advertId);
    await wishlist.save();
  }

  return wishlist;
};

/**
 * Remove an advert from the wishlist
 * @param {ObjectId} userId
 * @param {ObjectId} advertId
 * @returns {Promise<Wishlist>}
 */
const removeFromWishlist = async (userId, advertId) => {
  const wishlistModel = await Wishlist();
  const wishlist = await wishlistModel.findOne({ user: userId });

  if (!wishlist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Wishlist not found');
  }

  wishlist.adverts = wishlist.adverts.filter((id) => id.toString() !== advertId.toString());
  await wishlist.save();

  return wishlist;
};

/**
 * Get wishlist by user ID
 * @param {ObjectId} userId
 * @returns {Promise<Wishlist>}
 */
const getWishlist = async (userId) => {
  const wishlistModel = await Wishlist();
  const wishlist = await wishlistModel.find({ user: userId }).populate('adverts');
  return wishlist;
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
