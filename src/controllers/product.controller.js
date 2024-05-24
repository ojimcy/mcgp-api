const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { productService } = require('../services');

const createProduct = catchAsync(async (req, res) => {
  const createdBy = req.user._id;
  const product = await productService.createProduct(req.body, createdBy);
  res.status(httpStatus.CREATED).send(product);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProduct(req.params.productId);
  res.status(httpStatus.OK).send(product);
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'status', 'categoryId', 'brand', 'collection', 'createdBy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.getProducts(filter, options);
  res.status(httpStatus.OK).json(result);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.productId, req.body);
  res.status(httpStatus.OK).send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

const approveProduct = catchAsync(async (req, res) => {
  const approvedBy = req.user._id;
  const product = await productService.approveProduct(req.params.productId, approvedBy);
  res.status(httpStatus.OK).send(product);
});

const rejectProduct = catchAsync(async (req, res) => {
  const rejectedBy = req.user._id;
  const { rejectionReasons } = req.body;
  const product = await productService.rejectProduct(req.params.productId, rejectionReasons, rejectedBy);
  res.status(httpStatus.OK).send(product);
});

const getProductsByUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const filter = { createdBy: userId };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts(filter, options);
  res.status(httpStatus.OK).json(result);
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  approveProduct,
  rejectProduct,
  getProductsByUser,
};
