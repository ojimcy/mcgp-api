const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const categorySchema = mongoose.Schema(
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
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      require: false,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'is invalid'],
    },
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose documents to JSON
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

// Pre-save hook to generate slug if not provided
categorySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
  next();
});

module.exports = categorySchema;
