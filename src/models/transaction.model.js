const { getConnection } = require('./connection');
const transactionSchema = require('./transaction.schema');

let model = null;

/**
 * @returns Transaction
 */
const Transaction = async () => {
  if (!model) {
    const conn = await getConnection();
    model = conn.model('Transaction', transactionSchema);
  }

  return model;
};

module.exports = Transaction;
