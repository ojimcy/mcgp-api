const express = require('express');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth('createProduct'), validate(productValidation.createProduct), productController.createProduct)
  .get(auth('viewProducts'), validate(productValidation.getProducts), productController.getProducts);

router
  .route('/:productId/approve')
  .post(auth('manageProducts'), validate(productValidation.approveProduct), productController.approveProduct);

router
  .route('/:productId/reject')
  .post(auth('manageProducts'), validate(productValidation.rejectProduct), productController.rejectProduct);

router
  .route('/:productId')
  .get(auth('viewProducts'), validate(productValidation.getProduct), productController.getProduct)
  .patch(auth('viewProducts'), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(auth('viewProducts'), validate(productValidation.deleteProduct), productController.deleteProduct);

module.exports = router;
