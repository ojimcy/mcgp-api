const { getConnection } = require('./connection');
const paymentMethodSchema = require('./paymentAccount.schema');

let model = null;

/**
 * @returns PaymentMethod
 */
const PaymentMethod = async () => {
  if (!model) {
    const conn = await getConnection();
    model = conn.model('PaymentMethod', paymentMethodSchema);
  }

  return model;
};

module.exports = PaymentMethod;
