const express = require('express');
const validate = require('../../middlewares/validate');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');
const auth = require('../../middlewares/auth');
const multer = require('../../config/multer');

const router = express.Router();

router
  .route('/')
  .post(auth('order'), validate(orderValidation.createOrder), orderController.createOrder)
  .get(auth('order'), validate(orderValidation.getOrders), orderController.getOrders);

router.route('/get-all').get(auth('manageOrder'), validate(orderValidation.getOrders), orderController.getOrders);

router.route('/my-orders').get(auth(), orderController.getMyOrders);

router.route('/:orderId').get(auth('order'), validate(orderValidation.getOrder), orderController.getOrder);

router
  .route('/:orderId/pay')
  .post(auth('createAdvert'), multer.fields([{ name: 'proof', maxCount: 2 }]), orderController.payForOrder);
router
  .route('/:orderId/acknowlege')
  .post(auth('manageOrder'), validate(orderValidation.acknowledgePayment), orderController.acknowledgePayment);
router
  .route('/:orderId/release')
  .post(auth('order'), validate(orderValidation.releaseProduct), orderController.releaseProduct);
router
  .route('/:orderId/complete')
  .post(auth('order'), validate(orderValidation.completeOrder), orderController.completeOrder);

module.exports = router;
