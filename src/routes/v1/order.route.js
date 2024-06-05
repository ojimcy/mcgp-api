const express = require('express');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth('createOrder'), validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth('viewOrders'), orderController.getOrdersByUserId);

router.route('/get-all').get(auth('viewAllOrders'), validate(orderValidation.getOrders), orderController.getOrders);

module.exports = router;
