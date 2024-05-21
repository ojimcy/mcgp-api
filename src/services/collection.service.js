const httpStatus = require('http-status');
const Collection = require('../models/collection.model');
const ApiError = require('../utils/ApiError');

/**
 * Create a product collection
 * @param {Object} collectionBody
 * @returns {Promise<Collection>}
 */
const createCollection = async (collectionBody) => {
  const collectionModel = await Collection();

  if (await collectionModel.isNameTaken(collectionBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Collection name already taken');
  }
  return collectionModel.create(collectionBody);
};

/**
 * Query for product collections
 * @returns {Promise<QueryResult>}
 */
const queryCollections = async () => {
  const collectionModel = await Collection();

  return collectionModel.find();
};

/**
 * Get product collection by id
 * @param {ObjectId} id
 * @returns {Promise<Collection>}
 */
const getCollectionById = async (id) => {
  const collectionModel = await Collection();

  return collectionModel.findById(id);
};

/**
 * Update product collection by id
 * @param {ObjectId} collectionId
 * @param {Object} updateBody
 * @returns {Promise<Collection>}
 */
const updateCollectionById = async (collectionId, updateBody) => {
  const collectionModel = await Collection();

  const collection = await getCollectionById(collectionId);
  if (!collection) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Collection not found');
  }
  if (updateBody.name && (await collectionModel.isNameTaken(updateBody.name, collectionId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Collection name already taken');
  }
  Object.assign(collection, updateBody);
  await collection.save();
  return collection;
};

/**
 * Delete product collection by id
 * @param {ObjectId} collectionId
 * @returns {Promise<Collection>}
 */
const deleteCollectionById = async (collectionId) => {
  const collection = await getCollectionById(collectionId);
  if (!collection) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Collection not found');
  }
  await collection.deleteOne();
  return collection;
};

module.exports = {
  createCollection,
  queryCollections,
  getCollectionById,
  updateCollectionById,
  deleteCollectionById,
};
