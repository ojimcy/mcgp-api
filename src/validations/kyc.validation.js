const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createKycRequest = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    middleName: Joi.string().optional(),
    lastName: Joi.string().required(),
    dob: Joi.string().required(),
    resCountry: Joi.string().required(),
    resState: Joi.string().required(),
    resCity: Joi.string().required(),
    resAddress: Joi.string().required(),
    resPostalCode: Joi.string().required(),
    country: Joi.string().optional(),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    address: Joi.string().optional(),
    selfiePhotoFile: Joi.string().optional(),
    idPhotoFile: Joi.string().required(),
    idType: Joi.string().required(),
    idNumber: Joi.string().required(),
    issueDate: Joi.date().required(),
    expiryDate: Joi.date().required(),
  }),
};

const approveKycRequest = {
  params: Joi.object().keys({
    kycId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    status: Joi.string(),
  }),
};

const rejectKycRequest = {
  params: Joi.object().keys({
    kycId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    status: Joi.string(),
  }),
};

const viewKycRequests = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const viewKycRequest = {
  params: Joi.object().keys({
    kycId: Joi.string().custom(objectId),
  }),
};

const viewMyKycRequest = {
  query: Joi.object({
    id: Joi.string().custom(objectId),
    status: Joi.string().valid('pending', 'approved', 'rejected'),
  }),
};

module.exports = {
  createKycRequest,
  approveKycRequest,
  rejectKycRequest,
  viewKycRequests,
  viewKycRequest,
  viewMyKycRequest,
};
