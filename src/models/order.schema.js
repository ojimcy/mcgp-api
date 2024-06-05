const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const orderItemSchema = require('./orderItem.schema');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'canceled'],
      default: 'pending',
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
    },
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'crypto'],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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
    isPaymentConfirmed: {
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

module.exports = mongoose.model('Order', orderSchema);
