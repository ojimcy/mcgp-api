const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { collectionService } = require('../services');
const ApiError = require('../utils/ApiError');

const createCollection = catchAsync(async (req, res) => {
  const collection = await collectionService.createCollection(req.body);
  res.status(httpStatus.CREATED).json(collection);
});

const getCollections = catchAsync(async (req, res) => {
  const collections = await collectionService.queryCollections();
  res.json(collections);
});

const getCollection = catchAsync(async (req, res) => {
  const collection = await collectionService.getCollectionById(req.params.collectionId);
  if (!collection) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Collection not found');
  }
  res.json(collection);
});

const updateCollection = catchAsync(async (req, res) => {
  const collection = await collectionService.updateCollectionById(req.params.collectionId, req.body);
  res.json(collection);
});

const deleteCollection = catchAsync(async (req, res) => {
  await collectionService.deleteCollectionById(req.params.collectionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  deleteCollection,
};
