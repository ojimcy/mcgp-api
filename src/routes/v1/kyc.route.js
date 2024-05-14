const express = require('express');
const validate = require('../../middlewares/validate');
const kycValidation = require('../../validations/kyc.validation');
const kycController = require('../../controllers/kyc.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/request')
  .post(auth('createKycRequest'), validate(kycValidation.createKycRequest), kycController.createKycRequest)
  .get(auth('viewKycRequests'), validate(kycValidation.viewKycRequests), kycController.viewKycRequests);

router
  .route('/:kycId/approve')
  .post(auth('approveKycRequest'), validate(kycValidation.approveKycRequest), kycController.approveKycRequest);

router
  .route('/:kycId/reject')
  .post(auth('rejectKycRequest'), validate(kycValidation.rejectKycRequest), kycController.rejectKycRequest);

router
  .route('/pending')
  .get(auth('viewPendingKycRequests'), validate(kycValidation.viewKycRequests), kycController.viewPendingKycRequests);

router
  .route('/:kycId')
  .get(auth('viewKycRequest'), validate(kycValidation.viewKycRequest), kycController.viewKycRequest)
  .patch(auth('editKycRequest'), validate(kycValidation.viewKycRequest), kycController.viewKycRequest);

router
  .route('/my-request')
  .get(auth('viewMyKycRequest'), validate(kycValidation.viewMyKycRequest), kycController.viewMyKycRequest);

module.exports = router;
