const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Add plugin that converts mongoose to JSON
reviewSchema.plugin(toJSON);

module.exports = reviewSchema;
