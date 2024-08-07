const httpStatus = require('http-status');
const { Kyc } = require('../models');
const ApiError = require('../utils/ApiError');
const { getUserById } = require('./user.service');

/**
 * Create a KYC request
 * @param {Object} kycBody
 * @param {ObjectId} userId
 * @returns {Promise<Kyc>}
 */
const createKycRequest = async (kycBody, userId) => {
  const KycModel = await Kyc();
  const user = await getUserById(userId);
  // Validate KYC request body
  if (!kycBody || Object.keys(kycBody).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'KYC request body cannot be empty');
  }

  if (!user || !user.isEmailVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Email not verified');
  }

  const kycRequest = {
    ...kycBody,
    userId,
  };

  const kyc = await KycModel.create(kycRequest);
  if (!kyc) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'KYC request could not be created');
  }
  return kyc;
};

/**
 * Approve a KYC request
 * @param {ObjectId} kycId - The ID of the KYC request to approve
 * @returns {Promise<Kyc>} The approved KYC request
 * @throws {ApiError} If the KYC request with the specified ID is not found
 */
const approveKycRequest = async (kycId) => {
  const KycModel = await Kyc();
  const kyc = await KycModel.findById(kycId);

  if (!kyc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found');
  }

  kyc.status = 'approved';
  await kyc.save();

  const user = await getUserById(kyc.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.isKycVerified = true;
  await user.save();

  return kyc;
};

/**
 * Reject KYC request
 * @param {ObjectId} kycId - The ID of the KYC request to reject
 * @param {string[]} rejectionReasons - Array of rejection reasons
 * @returns {Promise<Kyc>} The rejected KYC request
 * @throws {ApiError} If the KYC request with the specified ID is not found
 */
const rejectKycRequest = async (kycId, rejectionReasons) => {
  const KycModel = await Kyc();

  const kyc = await KycModel.findById(kycId);
  if (!kyc) {
    throw new ApiError(httpStatus.NOT_FOUND, `Request not found`);
  }
  kyc.status = 'rejected';
  kyc.rejectionReasons = rejectionReasons;
  await kyc.save();

  return kyc;
};

/**
 * Query for kyc requests
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const viewKycRequests = async (filter, options) => {
  const KycModel = await Kyc();

  const kycRequests = await KycModel.paginate(filter, options);
  if (!kycRequests) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No KYC requests found');
  }
  return kycRequests;
};

/**
 * Get all pending KYC requests
 * @returns {Promise<Object<Kyc>>}
 */
const viewPendingKycRequests = async () => {
  const KycModel = await Kyc();

  const pendingRequests = await KycModel.find({ status: 'pending' }).exec();
  if (!pendingRequests) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No pending KYC requests found');
  }
  return pendingRequests;
};

/**
 * Get kyc request by id
 * @param {ObjectId} kycId
 * @returns {Promise<Kyc>}
 */
const viewKycRequest = async (kycId) => {
  const KycModel = await Kyc();

  const kycRequest = await KycModel.findById(kycId);
  if (!kycRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'KYC request not found');
  }
  return kycRequest;
};

/**
 * Get kyc request of the logged in user
 * @returns {Promise<Kyc>}
 */
const viewMyKycRequest = async (userId) => {
  const KycModel = await Kyc();

  const kycRequest = await KycModel.findOne({ userId });
  if (!kycRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'KYC request not found');
  }
  return kycRequest;
};

/**
 * Update KYC request
 * @param {ObjectId} kycId - The ID of the KYC request to update
 * @param {Object} updatedKycData - The updated KYC data
 * @returns {Promise<Kyc>} The updated KYC request
 * @throws {ApiError} If the KYC request with the specified ID is not found
 */
const updateKycRequest = async (kycId, updatedKycData) => {
  const KycModel = await Kyc();

  const kyc = await KycModel.findById(kycId);
  if (!kyc) {
    throw new ApiError(httpStatus.NOT_FOUND, `Request not found`);
  }

  // Update KYC document with new data
  Object.assign(kyc, updatedKycData);

  await kyc.save();

  return kyc;
};

module.exports = {
  createKycRequest,
  approveKycRequest,
  rejectKycRequest,
  viewKycRequests,
  viewPendingKycRequests,
  viewKycRequest,
  viewMyKycRequest,
  updateKycRequest,
};
