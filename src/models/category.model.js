const { getConnection } = require('./connection');
const categorySchema = require('./category.schema');

let model = null;

/**
 * @returns Category
 */
const Category = async () => {
  if (!model) {
    const conn = await getConnection();
    model = conn.model('Category', categorySchema);
  }

  return model;
};

module.exports = Category;
