const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const paymentMethodSchema = mongoose.Schema(
  {
    bank_transfer: {
      accountNumber: {
        type: String,
      },
      accountName: {
        type: String,
      },
      bankName: {
        type: String,
      },
    },
    crypto: {
      walletAddress: {
        type: String,
      },
      symbol: {
        type: String,
      },
      network: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
paymentMethodSchema.plugin(toJSON);

module.exports = paymentMethodSchema;
