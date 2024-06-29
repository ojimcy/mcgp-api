const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const multer = require('../../config/multer');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), multer.fields([{ name: 'profilePicture', maxCount: 1 }]), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers)
  .patch(auth('updateProfile'), multer.fields([{ name: 'profilePicture', maxCount: 1 }]), userController.updateProfile);

router
  .route('/reset-password')
  .post(auth('updateProfile'), validate(userValidation.resetPassword), userController.resetPassword);

router.get('/me', auth(), userController.me);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('updateUser'), multer.fields([{ name: 'profilePicture', maxCount: 1 }]), userController.updateUser)
  .delete(auth('deleteUser'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
