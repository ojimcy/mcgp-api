const mongoose = require('mongoose');
const config = require('../config/config');
const notificationSchema = require('./notification.schema');
const otpSchema = require('./otp.schema');
const tokenSchema = require('./token.schema');
const userSchema = require('./user.schema');
const userRoleSchema = require('./userRole.schema');
const categorySchema = require('./category.schema');
const brandSchema = require('./brand.schema');
const productCollectionSchema = require('./collection.schema');
const productSchema = require('./product.schema');
const cartSchema = require('./cart.schema');

let conn = null;

const getConnection = async () => {
  if (conn == null) {
    const options = {
      ...config.mongoose.options,
      ...{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // Buffering means mongoose will queue up operations if it gets
        // disconnected from MongoDB and send them when it reconnects.
        // With serverless, better to fail fast if not connected.
        bufferCommands: false, // Disable mongoose buffering
        // and tell the MongoDB driver to not wait more than 5 seconds
        // before erroring out if it isn't connected
        serverSelectionTimeoutMS: 5000,
      },
    };
    conn = mongoose.createConnection(config.mongoose.url, options);

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn;

    // Schema registration
    conn.model('Notification', notificationSchema);
    conn.model('Otp', otpSchema);
    conn.model('Token', tokenSchema);
    conn.model('User', userSchema);
    conn.model('UserRoles', userRoleSchema);
    conn.model('Category', categorySchema);
    conn.model('Brand', brandSchema);
    conn.model('Collection', productCollectionSchema);
    conn.model('Product', productSchema);
    conn.model('Cart', cartSchema);
  }

  return conn;
};

module.exports = { getConnection };
