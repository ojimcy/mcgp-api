const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const paymentSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Recieved', 'Failed'],
      default: 'Pending',
    },
    proof: {
      type: String,
      required: false,
    },
    accountDetails: {
      accountName: {
        type: String,
        required: false,
      },
      accountNumber: {
        type: String,
        required: false,
      },
      bankName: {
        type: String,
        required: false,
      },
      walletAddress: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
paymentSchema.plugin(toJSON);

module.exports = paymentSchema;
