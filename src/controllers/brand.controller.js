const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { brandService } = require('../services');
const ApiError = require('../utils/ApiError');

const createBrand = catchAsync(async (req, res) => {
  const brand = await brandService.createBrand(req.body);
  res.status(httpStatus.CREATED).json(brand);
});

const getBrands = catchAsync(async (req, res) => {
  const filter = req.query;
  const options = req.query;
  const brands = await brandService.queryBrands(filter, options);
  res.json(brands);
});

const getBrand = catchAsync(async (req, res) => {
  const brand = await brandService.getBrandById(req.params.brandId);
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  res.json(brand);
});

const updateBrand = catchAsync(async (req, res) => {
  const brand = await brandService.updateBrandById(req.params.brandId, req.body);
  res.send(brand);
});

const deleteBrand = catchAsync(async (req, res) => {
  await brandService.deleteBrandById(req.params.brandId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
};
