const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      required: false,
    },
    images: [{ type: String, required: true }],
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: false,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Brand',
    },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied', 'cancel'],
      default: 'pending',
      required: true,
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: Number,
        reviewText: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    ratings: {
      type: Number,
    },
    attributes: [
      {
        name: String,
        values: [String],
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isSbAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

module.exports = productSchema;
