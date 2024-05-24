const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    featuredImage: Joi.string(),
    images: Joi.array().items(Joi.string()).required(),
    price: Joi.number().required(),
    salePrice: Joi.number().required(),
    stock: Joi.number(),
    categoryId: Joi.string().custom(objectId).required(),
    brand: Joi.string().custom(objectId).required(),
    collections: Joi.array().items(Joi.string().custom(objectId)),
    status: Joi.string().valid('pending', 'approved', 'rejected', 'cancel'),
    attributes: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        values: Joi.array().items(Joi.string()),
      })
    ),
    isFeatured: Joi.boolean(),
    isSbAvailable: Joi.boolean(),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    title: Joi.string(),
    status: Joi.string(),
    categoryId: Joi.string().custom(objectId),
    brand: Joi.string().custom(objectId),
    createdBy: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const approveProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const rejectProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    rejectionReasons: Joi.array().items(Joi.string()).required(),
  }),
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
