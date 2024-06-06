const advertSchema = require('./advert.schema');
const { getConnection } = require('./connection');

let model = null;

/**
 * @returns module.exports = Advert;

 */
const Advert = async () => {
  if (!model) {
    const conn = await getConnection();
    model = conn.model('Ad', advertSchema);
  }

  return model;
};

module.exports = Advert;
