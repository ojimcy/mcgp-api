const { getConnection } = require('./connection');
const otpSchema = require('./otp.schema');

let model = null;

/**
 * @returns Otp
 */
const Otp = async () => {
  if (!model) {
    const conn = await getConnection();
    model = conn.model('Otp', otpSchema);
  }

  return model;
};

module.exports = Otp;
