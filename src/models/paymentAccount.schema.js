const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const paymentAccountSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['fiat', 'crypto'],
      required: true,
    },
    accountNumber: {
      type: String,
    },
    accountName: {
      type: String,
    },
    bankName: {
      type: String,
    },
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
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
paymentAccountSchema.plugin(toJSON);

module.exports = paymentAccountSchema;
