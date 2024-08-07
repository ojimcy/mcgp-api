const express = require('express');
const config = require('../../config/config');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const securityRoute = require('./security.route');
const notificationRoute = require('./notification.route');
const kycRoute = require('./kyc.route');
const categoryRoute = require('./category.route');
const brandRoute = require('./brand.route');
const collectionRoute = require('./collection.route');
const cartRoute = require('./cart.route');
const orderRoute = require('./order.route');
const advertsRoute = require('./adverts.route');
const paymentAccountRoute = require('./paymentAccount.route');
const wishListRoute = require('./wishList.route');
const accountRoute = require('./account.route');
const searchRoute = require('./search.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/security',
    route: securityRoute,
  },
  {
    path: '/notifications',
    route: notificationRoute,
  },
  {
    path: '/kyc',
    route: kycRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
  {
    path: '/brands',
    route: brandRoute,
  },
  {
    path: '/collections',
    route: collectionRoute,
  },
  {
    path: '/cart',
    route: cartRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
  {
    path: '/adverts',
    route: advertsRoute,
  },
  {
    path: '/payment-methods',
    route: paymentAccountRoute,
  },
  {
    path: '/wishlist',
    route: wishListRoute,
  },
  {
    path: '/account',
    route: accountRoute,
  },
  {
    path: '/search',
    route: searchRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
