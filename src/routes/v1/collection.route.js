const express = require('express');
const validate = require('../../middlewares/validate');
const collectionValidation = require('../../validations/collection.validation');
const collectionController = require('../../controllers/collection.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .post(auth('manageCollections'), validate(collectionValidation.createCollection), collectionController.createCollection)
  .get(auth('viewCollections'), validate(collectionValidation.getCollections), collectionController.getCollections);

router
  .route('/:collectionId')
  .get(auth('viewCollections'), validate(collectionValidation.getCollection), collectionController.getCollection)
  .patch(auth('manageCollections'), validate(collectionValidation.updateCollection), collectionController.updateCollection)
  .delete(auth('manageCollections'), validate(collectionValidation.deleteCollection), collectionController.deleteCollection);

module.exports = router;
