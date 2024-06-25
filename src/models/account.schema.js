const mongoose = require('mongoose');
const transactionSchema = require('./transaction.schema');

const withdrawalDetailsSchema = new mongoose.Schema(
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
  },
  { _id: false }
);

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    transactions: [transactionSchema],
    withdrawalDetails: [withdrawalDetailsSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = accountSchema;
