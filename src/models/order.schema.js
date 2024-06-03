const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderSchema = mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'canceled'],
      default: 'pending',
    },
    deliveryAddress: {
      fullName: {
        type: String,
        required: false,
      },
      phoneNumber: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['paypal', 'wallet'],
      required: true,
    },
    createdBy: { type: String, required: true, ref: 'User' },
    deliveredBy: { type: String, required: false, ref: 'User' },
    shippingPrice: { type: Number, required: false },
    isPaid: { type: Boolean, required: false, default: false },
    isDelivered: { type: Boolean, required: false, default: false },
    paidAt: { type: Date, required: false },
    deliveredAt: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

// Add plugins for toJSON and pagination
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

module.exports = orderSchema;
