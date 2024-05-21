const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
brandSchema.plugin(toJSON);
brandSchema.plugin(paginate);

/**
 * Check if brand is taken
 * @param {string} name - The brand's name
 * @param {ObjectId} [excludeBrandId] - The id of the brand to be excluded
 * @returns {Promise<boolean>}
 */
brandSchema.statics.isNameTaken = async function (name, excludeBrandId) {
  const brand = await this.findOne({ name, _id: { $ne: excludeBrandId } });
  return !!brand;
};

module.exports = brandSchema;
