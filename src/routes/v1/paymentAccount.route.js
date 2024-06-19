const express = require('express');
const validate = require('../../middlewares/validate');
const paymentAccountValidation = require('../../validations/paymentAccount.validation');
const paymentAccountController = require('../../controllers/paymentAccount.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(
    auth('managePaymentAccounts'),
    validate(paymentAccountValidation.createPaymentAccount),
    paymentAccountController.createPaymentAccount
  )
  .get(
    auth('getPaymentAccounts'),
    validate(paymentAccountValidation.getPaymentAccounts),
    paymentAccountController.getPaymentAccounts
  );

router
  .route('/:paymentAccountId')
  .get(
    auth('managePaymentAccounts'),
    validate(paymentAccountValidation.getPaymentAccount),
    paymentAccountController.getPaymentAccount
  )
  .patch(
    auth('managePaymentAccounts'),
    validate(paymentAccountValidation.updatePaymentAccount),
    paymentAccountController.updatePaymentAccount
  )
  .delete(
    auth('managePaymentAccounts'),
    validate(paymentAccountValidation.deletePaymentAccount),
    paymentAccountController.deletePaymentAccount
  );

module.exports = router;
