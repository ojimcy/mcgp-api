const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderSchema = new mongoose.Schema(
  {
    product: [
      {
        advert: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Advert',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paymentProof: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['bank_transfer', 'crypto'],
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    amount: {
      type: Number,
      required: true,
    },
    serviceFee: {
      type: Number,
      required: false,
    },
    deliveryAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    shippingPrice: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    proofOfPayment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins for toJSON and pagination
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

module.exports = orderSchema;
