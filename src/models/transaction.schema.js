const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    paymentMethod: {
      type: String,
      enum: ['fiat', 'crypto'],
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

// Add plugin that converts mongoose documents to JSON
transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

module.exports = transactionSchema;
