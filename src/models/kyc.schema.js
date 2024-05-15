const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// create opt model with userId, otp, and expiry

const kycSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      required: false,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    resCountry: {
      type: String,
      required: true,
      trim: true,
    },
    resState: {
      type: String,
      required: true,
      trim: true,
    },
    resCity: {
      type: String,
      required: true,
      trim: true,
    },
    resAddress: {
      type: String,
      required: true,
      trim: true,
    },
    resPostalCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: false,
      trim: true,
    },
    state: {
      type: String,
      required: false,
      trim: true,
    },
    city: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    postalCode: {
      type: String,
      required: false,
      trim: true,
    },
    selfiePhotoFile: {
      type: String,
      required: true,
      trim: true,
    },
    idPhotoFile: {
      type: String,
      required: false,
      trim: true,
    },
    idType: {
      type: String,
      required: true,
      trim: true,
    },
    idNumber: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
    rejectionReasons: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
kycSchema.plugin(toJSON);
kycSchema.plugin(paginate);

module.exports = kycSchema;
