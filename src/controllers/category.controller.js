const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const ApiError = require('../utils/ApiError');

const createCategory = catchAsync(async (req, res) => {
  const files = {
    image: req.files.image,
  };
  const category = await categoryService.createCategory(req.body, files);
  res.status(httpStatus.CREATED).json(category);
});

const getCategories = catchAsync(async (req, res) => {
  const filter = req.query;
  const options = req.query;
  const categories = await categoryService.queryCategories(filter, options);
  res.json(categories);
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  res.json(category);
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  res.send(category);
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
