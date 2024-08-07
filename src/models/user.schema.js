const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const parsePhoneNumber = require('libphonenumber-js');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    isTwoFactorAuthEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorAuthSecret: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      validate(value) {
        if (value && !validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      minlength: 4,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    profilePicture: {
      type: String,
      required: false,
      trim: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isKycVerified: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if phone number is taken
 * @param {string} phoneNumber - The user's phone number
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeUserId) {
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
  if (!parsedPhoneNumber) {
    throw new Error('Invalid phone number');
  }
  const normalizedPhoneNumber = parsedPhoneNumber.format('E.164');
  const user = await this.findOne({ phoneNumber: normalizedPhoneNumber, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

module.exports = userSchema;
