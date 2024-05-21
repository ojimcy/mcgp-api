const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCollection = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    products: Joi.array().items(Joi.string().custom(objectId)).allow(null, ''),
  }),
};

const getCollections = {
  query: Joi.object().keys({
    name: Joi.string(),
  }),
};

const getCollection = {
  params: Joi.object().keys({
    collectionId: Joi.string().custom(objectId),
  }),
};

const updateCollection = {
  params: Joi.object().keys({
    collectionId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    products: Joi.array().items(Joi.string().custom(objectId)),
  }),
};

const deleteCollection = {
  params: Joi.object().keys({
    collectionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  deleteCollection,
};
