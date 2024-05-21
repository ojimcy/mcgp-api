const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBrand = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    logo: Joi.string().optional().allow(null, ''),
  }),
};

const getBrands = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBrand = {
  params: Joi.object().keys({
    brandId: Joi.string().custom(objectId),
  }),
};

const updateBrand = {
  params: Joi.object().keys({
    brandId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().optional(),
      description: Joi.string().optional(),
      logo: Joi.string().optional().allow(null, ''),
    })
    .min(1),
};

const deleteBrand = {
  params: Joi.object().keys({
    brandId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
};
