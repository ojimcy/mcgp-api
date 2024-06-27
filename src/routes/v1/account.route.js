const express = require('express');
const validate = require('../../middlewares/validate');
const accountController = require('../../controllers/account.controller');
const accountValidation = require('../../validations/account.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth('account'), validate(accountValidation.getAccount), accountController.getAccount);
router.get('/:userId', auth('account'), accountController.getUserAccount);

router.post(
  '/withdraw',
  auth('account'),
  validate(accountValidation.requestWithdrawal),
  accountController.requestWithdrawal
);

router.post(
  '/withdraw/complete',
  auth('manageAccount'),
  validate(accountValidation.completeWithdrawal),
  accountController.completeWithdrawal
);
router.post('/payment-details', auth(), validate(accountValidation.updateAccount), accountController.updateAccount);

module.exports = router;
