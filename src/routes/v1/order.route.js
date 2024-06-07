const express = require('express');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/').post(auth('order'), validate(orderValidation.createOrder), orderController.createOrder);

router.route('/:orderId').get(auth('viewAdverts'), validate(orderValidation.getOrder), orderController.getOrder);

module.exports = router;
