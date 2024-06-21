const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adverts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advert',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
wishlistSchema.plugin(toJSON);
wishlistSchema.plugin(paginate);

module.exports = wishlistSchema;
