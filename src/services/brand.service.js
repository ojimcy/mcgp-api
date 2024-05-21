const httpStatus = require('http-status');
const { Brand } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a brand
 * @param {Object} brandBody
 * @returns {Promise<Brand>}
 */
const createBrand = async (brandBody) => {
  const brandModel = await Brand();

  if (await brandModel.isNameTaken(brandBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Brand name already taken');
  }
  return brandModel.create(brandBody);
};

/**
 * Query for brands
 * @returns {Promise<QueryResult>}
 */
const queryBrands = async () => {
  const brandModel = await Brand();

  return brandModel.find();
};

/**
 * Get brand by id
 * @param {ObjectId} id
 * @returns {Promise<Brand>}
 */
const getBrandById = async (id) => {
  const brandModel = await Brand();

  return brandModel.findById(id);
};

/**
 * Update brand by id
 * @param {ObjectId} brandId
 * @param {Object} updateBody
 * @returns {Promise<Brand>}
 */
const updateBrandById = async (brandId, updateBody) => {
  const brandModel = await Brand();
  const brand = await getBrandById(brandId);
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  if (updateBody.name && (await brandModel.isNameTaken(updateBody.name, brandId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Brand name already taken');
  }
  Object.assign(brand, updateBody);
  await brand.save();
  return brand;
};

/**
 * Delete brand by id
 * @param {ObjectId} brandId
 * @returns {Promise<Brand>}
 */
const deleteBrandById = async (brandId) => {
  const brandModel = await Brand();
  const brand = brandModel.findById(brandId);
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  await brandModel.deleteOne({ _id: brandId });
  return brand;
};

module.exports = {
  createBrand,
  queryBrands,
  getBrandById,
  updateBrandById,
  deleteBrandById,
};
