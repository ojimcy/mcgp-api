const { getConnection } = require('./connection');
const paymentSchema = require('./payment.schema');

let model = null;

/**
 * @returns Payment
 */
const Payment = async () => {
  if (!model) {
    const conn = await getConnection();
    model = conn.model('Payment', paymentSchema);
  }

  return model;
};

module.exports = Payment;
