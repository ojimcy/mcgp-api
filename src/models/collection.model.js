const { getConnection } = require('./connection');
const productCollectionSchema = require('./collection.schema');

let model = null;

/**
 * @returns Collection
 */
const Collection = async () => {
  if (!model) {
    const conn = await getConnection();
    model = conn.model('Collection', productCollectionSchema);
  }

  return model;
};

module.exports = Collection;
