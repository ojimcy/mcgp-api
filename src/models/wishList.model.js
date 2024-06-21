const { getConnection } = require('./connection');
const wishlistSchema = require('./wishList.schema');

let model = null;

/**
 * @returns Wishlist
 */
const Wishlist = async () => {
  if (!model) {
    const conn = await getConnection();
    model = conn.model('Wishlist', wishlistSchema);
  }

  return model;
};

module.exports = Wishlist;
