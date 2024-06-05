/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');
const { getUserById } = require('./user.service');
const { uploadImage, uploadImages } = require('./imageUpload.service');

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody, createdBy, files) => {
  const productModel = await Product();
  const user = await getUserById(createdBy);

  if (!user.isKycVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Please complete KYC verification');
  }

  const featuredImageUrl = files.featuredImage ? await uploadImage(files.featuredImage[0].path) : null;
  const imageUrls = await uploadImages(files.images);

  const productData = {
    ...productBody,
    featuredImage: featuredImageUrl,
    images: imageUrls,
    createdBy,
  };

  return productModel.create(productData);
};

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getProducts = async (filter, options) => {
  const productModel = await Product();
  return productModel.paginate(filter, options);
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProduct = async (id) => {
  const productModel = await Product();
  return productModel.findById(id);
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProduct = async (productId, updateBody, files) => {
  const product = await getProduct(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  if (files.featuredImage) {
    const featuredImageUrl = await uploadImage(files.featuredImage[0].path);
    updateBody.featuredImage = featuredImageUrl;
  }

  if (files.images && files.images.length > 0) {
    const imageUrls = await uploadImages(files.images);
    updateBody.images = imageUrls;
  }

  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProduct = async (productId) => {
  const product = await getProduct(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.remove();
  return product;
};

/**
 * Approve product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const approveProduct = async (productId, approvedByUserId) => {
  const product = await getProduct(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  product.status = 'approved';
  product.approvedBy = approvedByUserId;
  await product.save();
  return product;
};

/**
 * Reject product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const rejectProduct = async (productId, rejectionReasons, rejectedByUserId) => {
  const product = await getProduct(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  product.status = 'rejected';
  product.rejectionReasons = rejectionReasons;
  product.rejectedBy = rejectedByUserId;
  await product.save();
  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
  rejectProduct,
};