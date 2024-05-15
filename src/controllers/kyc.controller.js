const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { kycService } = require('../services');
const ApiError = require('../utils/ApiError');

const createKycRequest = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { user } = req;
  // Check if the user's email is verified
  if (!user || !user.isEmailVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Email not verified');
  }
  const result = await kycService.createKycRequest(req.body, userId);
  res.status(httpStatus.CREATED).send(result);
});

const approveKycRequest = catchAsync(async (req, res) => {
  const { kycId } = req.params;
  const result = await kycService.approveKycRequest(kycId);
  res.status(httpStatus.OK).send(result);
});

const rejectKycRequest = catchAsync(async (req, res) => {
  const { kycId } = req.params;
  const { rejectionReasons } = req.body;
  const result = await kycService.rejectKycRequest(kycId, rejectionReasons);
  res.status(httpStatus.OK).send(result);
});

const viewKycRequests = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const results = await kycService.viewKycRequests(filter, options);
  res.status(httpStatus.OK).send(results);
});

const viewPendingKycRequests = catchAsync(async (req, res) => {
  const kycRequests = await kycService.viewPendingKycRequests();
  res.status(httpStatus.OK).send(kycRequests);
});

const viewKycRequest = catchAsync(async (req, res) => {
  const kycRequest = await kycService.viewKycRequest(req.params.kycId);
  res.status(httpStatus.OK).json(kycRequest);
});

const viewMyKycRequest = catchAsync(async (req, res) => {
  const { _id: userId } = req.user;
  const kycRequest = await kycService.viewMyKycRequest(userId);
  res.status(httpStatus.OK).json(kycRequest);
});

const updateKycRequest = catchAsync(async (req, res) => {
  const { kycId } = req.params;
  const { updatedKycData } = req.body;

  const result = await kycService.updateKycRequest(kycId, updatedKycData);
  res.status(httpStatus.OK).send(result);
});

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
