const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getCategories = {
  query: Joi.object().keys({
    title: Joi.string(),
    slug: Joi.string(),
    type: Joi.string(),
    parentCategory: Joi.string().custom(objectId),
    isFeatured: Joi.bool(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const getSubCategories = {
  query: Joi.object().keys({
    parentCategoryId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getSubCategories,
};
