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
    throw new ApiError(httpStatus.FORBIDDEN, 'Please complete KYC verification');
  }

  const featuredImageUrl = files.featuredImage ? await uploadImage(files.featuredImage[0].path) : null;
  const imageUrls = await uploadImages(files.images);

  const adData = {
    ...createdBy,
    featuredImage: featuredImageUrl,
    images: imageUrls,
    createdBy,
  };

  const ad = await AdvertModel.create(adData);
  return ad;
};

/**
 * Query for ads
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryAds = async (filter, options) => {
  const AdvertModel = await Advert();
  const ads = await AdvertModel.paginate(filter, options);
  return ads;
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
 * @returns {Promise<Advert>}
 */
const updateAdById = async (advertId, updateBody, files) => {
  const ad = await getAdById(advertId);
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Advert not found');
  }

  if (files.featuredImage) {
    const featuredImageUrl = await uploadImage(files.featuredImage[0].path);
    updateBody.featuredImage = featuredImageUrl;
  }

  if (files.images && files.images.length > 0) {
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
const deleteAdById = async (advertId) => {
  const ad = await getAdById(advertId);
  if (!ad) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Advert not found');
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

module.exports = {
  createAd,
  queryAds,
  getAdById,
  updateAdById,
  deleteAdById,
  approveAd,
  rejectAd,
};
