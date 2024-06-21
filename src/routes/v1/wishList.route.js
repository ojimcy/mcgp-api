const express = require('express');
const auth = require('../../middlewares/auth');
const wishlistController = require('../../controllers/wishList.controller');

const router = express.Router();

router.route('/').get(auth(), wishlistController.getWishlist);

router
  .route('/:advertId')
  .post(auth(), wishlistController.addToWishlist)
  .delete(auth(), wishlistController.removeFromWishlist);

module.exports = router;
