const express = require('express');
const validate = require('../../middlewares/validate');
const advertValidation = require('../../validations/advert.validation');
const advertController = require('../../controllers/advert.controller');
const auth = require('../../middlewares/auth');
const multer = require('../../config/multer');

const router = express.Router();

router
  .route('/')
  .post(
    auth('createAdvert'),
    multer.fields([
      { name: 'featuredImage', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
    advertController.createAd
  )
  .get(auth('viewAdverts'), validate(advertValidation.getAds), advertController.getAds);

router
  .route('/:advertId/approve')
  .post(auth('manageAdverts'), validate(advertValidation.approveAd), advertController.approveAd);

router
  .route('/:advertId/reject')
  .post(auth('manageAdverts'), validate(advertValidation.rejectAd), advertController.rejectAd);

router
  .route('/:advertId')
  .get(auth('viewAdverts'), validate(advertValidation.getAd), advertController.getAd)
  .patch(
    auth('viewAdverts'),
    validate(advertValidation.updateAd),
    multer.fields([
      { name: 'featuredImage', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]),
    advertController.updateAd
  )
  .delete(auth('viewAdverts'), validate(advertValidation.deleteAd), advertController.deleteAd);

router.route('/:advertId/review').post(auth('addReview'), validate(advertValidation.addReview), advertController.addReview);

module.exports = router;
