const express = require('express');
const validate = require('../../middlewares/validate');
const cartValidation = require('../../validations/cart.validation');
const cartController = require('../../controllers/cart.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth('manageCart'), validate(cartValidation.addToCart), cartController.addToCart)
  .get(auth('manageCart'), cartController.getCart)
  .delete(auth('manageCart'), cartController.clearCart);

router
  .route('/:productId')
  .post(auth('manageCart'), validate(cartValidation.removeItemFromCart), cartController.removeItemFromCart);

module.exports = router;
