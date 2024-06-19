const { getConnection } = require('./connection');
const paymentAccountSchema = require('./paymentAccount.schema');

let model = null;

/**
 * @returns PaymentAccount
 */
const PaymentAccount = async () => {
  if (!model) {
    const conn = await getConnection();
    model = conn.model('PaymentAccount', paymentAccountSchema);
  }

  return model;
};

module.exports = PaymentAccount;
