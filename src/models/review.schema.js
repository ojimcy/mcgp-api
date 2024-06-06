const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

// create opt model with userId, otp, and expiry

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
// add plugin that converts mongoose to json
reviewSchema.plugin(toJSON);

module.exports = reviewSchema;
