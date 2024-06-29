/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const httpStatus = require('http-status');
const parsePhoneNumber = require('libphonenumber-js');
const { User, Account } = require('../models');
const ApiError = require('../utils/ApiError');
const { uploadImage } = require('./imageUpload.service');

/**
 * Normalize the provided phone number
 * @param {string} phoneNumber
 * @returns {string} Normalized phone number
 */
const normalizePhoneNumber = (phoneNumber) => {
  // Parse and normalize the phone number
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber, 'NG');

  // Basic validation
  if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
    return parsedPhoneNumber.format('E.164');
  }

  // Throw an error for invalid phone numbers
  throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid phone number');
};

/**
 * Create a user
 * @param {Object} userBody
 * @param {Object} files
 * @returns {Promise<User>}
 */
const createUser = async (userBody, files) => {
  const UserModel = await User();
  const AccountModel = await Account();

  // Normalize the provided phone number
  const normalizedPhoneNumber = normalizePhoneNumber(userBody.phoneNumber);

  // Check if the email is already taken
  if (await UserModel.isPhoneNumberTaken(userBody.phoneNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already taken');
  } else if (userBody.email && (await UserModel.isEmailTaken(userBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (files && files.profilePicture && files.profilePicture.length > 0) {
    const photoUrl = await uploadImage(files.profilePicture[0].path);
    userBody.profilePicture = photoUrl;
  }

  // Create the user object with normalized phone number
  const referralCode = Math.floor(100000 + Math.random() * 900000);
  const user = new UserModel({ ...userBody, phoneNumber: normalizedPhoneNumber, referralCode });
  const savedUser = await user.save();

  // Create an account for the new user
  const account = new AccountModel({ user: savedUser._id });
  await account.save();

  return savedUser;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const userModel = await User();
  const users = await userModel.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const userModel = await User();
  return userModel.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  const userModel = await User();
  return userModel.findOne({ email });
};

const getUserByPhoneNumber = async (phoneNumber) => {
  const userModel = await User();

  // Ensure that phoneNumber is a non-null string before attempting to parse
  const normalizedPhoneNumber = typeof phoneNumber === 'string' ? parsePhoneNumber(phoneNumber, 'NG').format('E.164') : null;

  return userModel.findOne({ phoneNumber: normalizedPhoneNumber });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, files) => {
  const userModel = await User();
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await userModel.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (files && files.profilePicture && files.profilePicture.length > 0) {
    const photoUrl = await uploadImage(files.profilePicture[0].path);
    updateBody.profilePicture = photoUrl;
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Update user's profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Update data
 * @returns {Promise<User>} Updated user profile
 */
const updateProfile = async (userId, updateData, files) => {
  const userModel = await User();
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (updateData.email && (await userModel.isEmailTaken(updateData.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (files && files.profilePicture && files.profilePicture.length > 0) {
    const photoUrl = await uploadImage(files.profilePicture[0].path);
    updateData.profilePicture = photoUrl;
  }

  Object.assign(user, updateData);
  await user.save();

  return user;
};

/**
 * Reset password
 * @param {string} userId - User ID
 * @param {string} password - Old password
 * @param {string} newPassword - New password
 * @returns {Promise}
 */
const resetPassword = async (userId, password, newPassword, confirmNewPassword) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the old password matches the user's current password
  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
  }

  // Check if the new password is confirmed
  if (newPassword !== confirmNewPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'New password and confirm password do not match');
  }

  // Update the user's password with the new password
  user.password = newPassword;
  await user.save();
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByPhoneNumber,
  updateUserById,
  deleteUserById,
  updateProfile,
  resetPassword,
};
