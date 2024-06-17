const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');
const { uploadImage } = require('./imageUpload.service');

/**
 * Create a category
 * @param {Object} categoryBody
 * @param {Object} files
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody, files) => {
  const categoryModel = await Category();
  // Check if category with the same title already exists
  const existingCategory = await categoryModel.findOne({ title: categoryBody.title });
  if (existingCategory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category with this title already exists');
  }

  let imageUrl = null;
  if (files && files.image && files.image.length > 0) {
    imageUrl = await uploadImage(files.image[0].path);
  }

  const categoryData = {
    ...categoryBody,
    image: imageUrl,
  };
  const category = await categoryModel.create(categoryData);
  return category;
};

/**
 * Query for categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async (filter, options) => {
  const categoryModel = await Category();

  const categories = await categoryModel.paginate(filter, options);
  return categories;
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  const categoryModel = await Category();

  return categoryModel.findById(id);
};

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.remove();
  return category;
};

/**
 * Get sub-categories by parent category id
 * @param {ObjectId} parentCategoryId
 * @returns {Promise<QueryResult>}
 */
const getSubCategories = async (parentCategoryId) => {
  const subCategories = await Category.find({ parentCategory: parentCategoryId });
  return subCategories;
};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getSubCategories,
};
