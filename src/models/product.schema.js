const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    reviewText: String,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    featuredImage: {
      type: String,
      required: false,
      default: '',
    },
    images: [{ type: String, required: true }],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [reviewSchema],
    ratings: {
      type: Number,
      min: 0,
      max: 5,
    },
    attributes: [
      {
        name: {
          type: String,
          required: true,
        },
        values: [
          {
            type: String,
            required: true,
          },
        ],
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

// Add indexes for frequently queried fields
productSchema.index({ categoryId: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isFeatured: 1 });

// Add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

module.exports = productSchema;
