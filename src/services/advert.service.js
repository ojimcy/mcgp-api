/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { Advert } = require('../models');
const ApiError = require('../utils/ApiError');
const { getUserById } = require('./user.service');
const { uploadImage, uploadImages } = require('./imageUpload.service');

/**
 * Create an advert
 * @param {Object} adBody
 * @returns {Promise<Advert>}
 */
const createAd = async (adBody, createdBy, files) => {
  const AdvertModel = await Advert();
  const user = await getUserById(createdBy);

  if (!user.isKycVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Please complete KYC verification!');
  }
  const featuredImageUrl = files.featuredImage ? await uploadImage(files.featuredImage[0].path) : null;
  const imageUrls = await uploadImages(files.images);
  const adData = {
    ...adBody,
    featuredImage: featuredImageUrl,
    images: imageUrls,
    createdBy,
  };

  const advert = await AdvertModel.create(adData);
  return advert;
};

/**
 * Query for ads
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryAds = async (filter, options) => {
  const AdvertModel = await Advert();
  const adverts = await AdvertModel.paginate(filter, options);
  return adverts;
};

/**
 * Get ad by id
 * @param {ObjectId} id
 * @returns {Promise<Advert>}
 */
const getAdById = async (id) => {
  const AdvertModel = await Advert();
  return AdvertModel.findById(id);
};

/**
 * Update ad by id
 * @param {ObjectId} advertId
 * @param {Object} updateBody
 * @param {Object} files
 * @param {Object} user
 * @returns {Promise<Advert>}
 */
const updateAdById = async (advertId, updateBody, files, userId) => {
  const ad = await getAdById(advertId);
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Advert not found');
  }

  // Check if the user is the creator of the ad or an admin
  const user = await getUserById(userId);
  if (ad.createdBy.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this ad');
  }

  if (files && files.featuredImage && files.featuredImage.length > 0) {
    const featuredImageUrl = await uploadImage(files.featuredImage[0].path);
    updateBody.featuredImage = featuredImageUrl;
  }

  if (files && files.images && files.images.length > 0) {
    const imageUrls = await uploadImages(files.images);
    updateBody.images = imageUrls;
  }

  Object.assign(ad, updateBody);
  await ad.save();
  return ad;
};

/**
 * Delete ad by id
 * @param {ObjectId} advertId
 * @returns {Promise<Advert>}
 */
const deleteAdById = async (advertId, userId) => {
  const ad = await getAdById(advertId);
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Advert not found');
  }

  const user = await getUserById(userId);
  if (ad.createdBy.toString() !== user._id.toString() && user.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete this ad');
  }

  await ad.remove();
  return ad;
};

/**
 * Approve ad by id
 * @param {ObjectId} advertId
 * @returns {Promise<Advert>}
 */
const approveAd = async (advertId, approvedByUserId) => {
  const ad = await getAdById(advertId);
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Advert not found');
  }
  ad.status = 'approved';
  ad.approvedBy = approvedByUserId;
  await ad.save();
  return ad;
};

/**
 * Reject product by id
 * @param {ObjectId} advertId
 * @returns {Promise<Product>}
 */
const rejectAd = async (advertId, rejectionReasons, rejectedByUserId) => {
  const ad = await getAdById(advertId);
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Advert not found');
  }
  ad.status = 'rejected';
  ad.rejectionReasons = rejectionReasons;
  ad.rejectedBy = rejectedByUserId;
  await ad.save();
  return ad;
};

/**
 * Add or update review for an ad
 * @param {ObjectId} advertId
 * @param {ObjectId} userId
 * @param {Number} rating
 * @param {String} reviewText
 * @returns {Promise<Advert>}
 */
const addReview = async (advertId, userId, rating, reviewText) => {
  const ad = await getAdById(advertId);
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Advert not found');
  }

  // Check if the user has already reviewed the ad
  const existingReview = ad.reviews.find((r) => r.userId.toString() === userId.toString());

  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.reviewText = reviewText;
    existingReview.date = Date.now();
  } else {
    // Add new review
    ad.reviews.push({ userId, rating, reviewText });
  }

  // Calculate the new average rating
  const totalRatings = ad.reviews.length;
  const sumRatings = ad.reviews.reduce((acc, curr) => acc + curr.rating, 0);
  ad.averageRating = sumRatings / totalRatings;

  await ad.save();
  return ad;
};

module.exports = {
  createAd,
  queryAds,
  getAdById,
  updateAdById,
  deleteAdById,
  approveAd,
  rejectAd,
  addReview,
};
