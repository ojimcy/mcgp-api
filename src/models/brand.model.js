const { getConnection } = require('./connection');
const brandSchema = require('./brand.schema');

let model = null;

/**
 * @returns Brand
 */
const Brand = async () => {
  if (!model) {
    const conn = await getConnection();
    model = conn.model('Brand', brandSchema);
  }

  return model;
};

module.exports = Brand;
