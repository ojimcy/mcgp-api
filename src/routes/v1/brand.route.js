const express = require('express');
const validate = require('../../middlewares/validate');
const brandValidation = require('../../validations/brand.validation');
const brandController = require('../../controllers/brand.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth('manageBrands'), validate(brandValidation.createBrand), brandController.createBrand)
  .get(auth('viewBrands'), validate(brandValidation.getBrands), brandController.getBrands);

router
  .route('/:brandId')
  .get(auth('viewBrands'), validate(brandValidation.getBrand), brandController.getBrand)
  .patch(auth('manageBrands'), validate(brandValidation.updateBrand), brandController.updateBrand)
  .delete(auth('manageBrands'), validate(brandValidation.deleteBrand), brandController.deleteBrand);

module.exports = router;
