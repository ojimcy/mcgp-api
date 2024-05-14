const httpStatus = require('http-status');
const validator = require('validator');
const { authenticator } = require('otplib');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const securityService = require('./security.service');
const { Otp } = require('../models');

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password, otp) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  if (!user.isActive) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Account deactivated, pls contact admin');
  }

  if (user.isTwoFactorAuthEnabled) {
    if (!otp) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'OTP is required');
    }

    const isValid = authenticator.verify({ token: otp, secret: user.twoFactorAuthSecret });
    if (!isValid) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid OTP');
    }
  }

  return user;
};

/**
 * Login with email or phone number and password
 * @param {string} identifier - Email or phone number
 * @param {string} password
 * @param {string} otp - One-time password for two-factor authentication
 * @returns {Promise<User>}
 */
const loginUser = async (identifier, password, otp) => {
  // Check if the identifier is an email or a phone number
  const isEmail = validator.isEmail(identifier);
  const isPhoneNumber = validator.isMobilePhone(identifier, 'any', { strictMode: false });

  if (!isEmail && !isPhoneNumber) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or phone number format');
  }

  let user;
  if (isEmail) {
    // Login with email
    user = await userService.getUserByEmail(identifier);
  } else {
    // Login with phone number
    user = await userService.getUserByPhoneNumber(identifier);
  }

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found. Please check your email or phone number.');
  }

  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password. Please try again.');
  }

  if (!user.isActive) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Account deactivated, pls contact admin');
  }

  if (user.isTwoFactorAuthEnabled) {
    if (!otp) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'OTP is required for two-factor authentication.');
    }

    const isValid = authenticator.verify({ token: otp, secret: user.twoFactorAuthSecret });
    if (!isValid) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid OTP. Please enter a valid OTP.');
    }
  }

  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const TokenModel = await Token();
  const refreshTokenDoc = await TokenModel.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const forgotPassword = async (email) => {
  try {
    const userId = await userService.getUserByEmail(email);
    const action = 'reset your password';
    await securityService.sendOtp(userId, action);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error);
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (otp, newPassword, confirmNewPassword) => {
  try {
    const OtpModel = await Otp();
    // Find the OTP document using the OTP
    const otpDoc = await OtpModel.findOne({ otp });
    if (!otpDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
    }

    await securityService.validateOtp(otpDoc.userId, otp);
    const user = await userService.getUserById(otpDoc.userId);
    if (!user) {
      throw new Error();
    }

    // Check if the new password is confirmed
    if (newPassword !== confirmNewPassword) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'New password and confirm password do not match');
    }

    await userService.updateUserById(user.id, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

/**
 * Verify email
 * @param {string} otp
 * @returns {Promise}
 */
const verifyEmail = async (userId, otp) => {
  try {
    await securityService.validateOtp(userId, otp);
    await userService.updateUserById(userId, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error);
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  loginUser,
  logout,
  refreshAuth,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
