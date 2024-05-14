const { getConnection } = require('./connection');
const kycSchema = require('./kyc.schema');

let model = null;

/**
 * @returns Kyc
 */
const Kyc = async () => {
  if (!model) {
    const conn = await getConnection();
    model = conn.model('Kyc', kycSchema);
  }

  return model;
};

module.exports = Kyc;
