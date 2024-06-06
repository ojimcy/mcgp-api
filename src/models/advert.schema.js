const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const reviewSchema = require('./review.schema');

const advertSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: false,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['Product', 'Service'],
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    featuredImage: {
      type: String,
      required: false,
      trim: true,
    },
    images: {
      type: [String],
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
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
      { _id: false },
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

// Add plugin that converts mongoose documents to JSON
advertSchema.plugin(toJSON);
advertSchema.plugin(paginate);

module.exports = mongoose.model('Advert', advertSchema);
