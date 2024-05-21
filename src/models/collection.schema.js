const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productCollectionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productCollectionSchema.plugin(toJSON);
productCollectionSchema.plugin(paginate);

/**
 * Check if brand is taken
 * @param {string} name - The brand's name
 * @param {ObjectId} [excludeCollectionId] - The id of the brand to be excluded
 * @returns {Promise<boolean>}
 */
productCollectionSchema.statics.isNameTaken = async function (name, excludeCollectionId) {
  const brand = await this.findOne({ name, _id: { $ne: excludeCollectionId } });
  return !!brand;
};

module.exports = productCollectionSchema;
