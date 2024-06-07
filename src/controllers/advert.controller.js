const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { adService } = require('../services');
const pick = require('../utils/pick');

const createAd = catchAsync(async (req, res) => {
  const createdBy = req.user._id;
  const files = {
    featuredImage: req.files.featuredImage,
    images: req.files.images,
  };

  const ad = await adService.createAd(req.body, createdBy, files);
  res.status(httpStatus.CREATED).json(ad);
});

const getAds = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'status', 'category', 'createdBy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const ads = await adService.queryAds(filter, options);
  res.status(httpStatus.OK).json(ads);
});

const getAd = catchAsync(async (req, res) => {
  const ad = await adService.getAdById(req.params.advertId);
  res.status(httpStatus.OK).json(ad);
});

const updateAd = catchAsync(async (req, res) => {
  const { advertId } = req.params;
  const updateBody = req.body;
  const { files } = req;

  const ad = await adService.updateAdById(advertId, updateBody, files);
  res.status(httpStatus.OK).json(ad);
});

const deleteAd = catchAsync(async (req, res) => {
  await adService.deleteAdById(req.params.advertId);
  res.status(httpStatus.NO_CONTENT).send();
});

const approveAd = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const ad = await adService.approveAd(req.params.advertId, userId);
  res.json(ad);
});

const rejectAd = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const ad = await adService.rejectAd(req.params.advertId, req.body.rejectionReasons, userId);
  res.json(ad);
});

module.exports = {
  createAd,
  getAds,
  getAd,
  updateAd,
  deleteAd,
  approveAd,
  rejectAd,
};