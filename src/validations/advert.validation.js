const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAd = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    salePrice: Joi.number().min(0).required().less(Joi.ref('price')),
    type: Joi.string().valid('Product', 'Service').required(),
    stock: Joi.number().min(0),
    category: Joi.string().custom(objectId).required(),
    status: Joi.string().valid('Pending', 'Approved', 'Rejected'),
    createdBy: Joi.string().custom(objectId).required(),
    approvedBy: Joi.string().custom(objectId),
    rejectedBy: Joi.string().custom(objectId),
    reviews: Joi.array().items(Joi.object()),
    ratings: Joi.number().min(0).max(5),
    attributes: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        values: Joi.array().items(Joi.string().required()),
      })
    ),
    isFeatured: Joi.boolean(),
    isSbAvailable: Joi.boolean(),
  }),
};

const updateAd = {
  params: Joi.object().keys({
    advertId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().min(1),
};

const getAds = {
  query: Joi.object().keys({
    title: Joi.string(),
    status: Joi.string(),
    category: Joi.string().custom(objectId),
    createdBy: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAd = {
  params: Joi.object().keys({
    advertId: Joi.string().custom(objectId),
  }),
};

const deleteAd = {
  params: Joi.object().keys({
    advertId: Joi.string().custom(objectId),
  }),
};

const approveAd = {
  params: Joi.object().keys({
    adId: Joi.string().custom(objectId),
  }),
};

const rejectAd = {
  params: Joi.object().keys({
    adId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    rejectionReasons: Joi.string().required(),
  }),
};

module.exports = {
  createAd,
  updateAd,
  getAds,
  getAd,
  deleteAd,
  approveAd,
  rejectAd,
};
