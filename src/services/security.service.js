const crypto = require('crypto');
const { authenticator } = require('otplib');
const QRCode = require('qrcode');
const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { Otp, User } = require('../models');
const { emailTemplates, sendEmail } = require('./email.service');

/**
 * Generates a random 6-digit number
 * @returns {number} Random 6-digit number
 */
const generateRandomNumber = () => {
  const min = 100000;
  const max = 999999;
  const randomBytes = crypto.randomBytes(2);
  const randomNumber = randomBytes.readUInt16BE(0);
  return min + Math.floor((randomNumber / 65535) * (max - min + 1));
};

/**
 *
 * @param {string} userId
 * @returns {Promise<string>}
 */
const sendOtp = async (userId, action = 'complete your action') => {
  const OtpModel = await Otp();
  const UserModel = await User();
  // delete all otps for this user
  await OtpModel.deleteMany({ userId });

  // generate new otp
  const otp = generateRandomNumber();
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 15); // OTP expiry time
  const otpDoc = await OtpModel.create({ userId, otp, expiry });
  const user = await UserModel.findById(userId);
  await sendEmail(
    { to: user.email, subject: 'MCGP OTP', template: emailTemplates.OTP },
    { otp: otpDoc.otp, name: user.firstName, action }
  );
  return otpDoc.otp;
};

/**
 * Validate OTP
 * @param {string} userId - User ID
 * @param {string} otp - One-time password
 * @returns {Promise<void>}
 * @throws {ApiError} If OTP is invalid or expired
 */
const validateOtp = async (userId, otp) => {
  const OtpModel = await Otp();
  const otpDoc = await OtpModel.findOne({ userId, otp });

  if (!otpDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
  }

  if (otpDoc.isUsed) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OTP already used');
  }

  if (otpDoc.expiry < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OTP has expired');
  }

  otpDoc.isUsed = true;

  await otpDoc.save();
};

/**
 *
 * @param {string} userId
 * @returns {Promise<{qrCode: string, secret: string}>}
 * @throws {ApiError}
 * @throws {Error}
 *
 * @description This function will initialize 2FA for the user
 */
const init2fa = async (userId) => {
  const UserModel = await User();
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isTwoFactorAuthEnabled) {
    throw new ApiError(httpStatus.BAD_REQUEST, '2FA already enabled');
  }

  const secret = authenticator.generateSecret();
  await UserModel.updateOne({ _id: userId }, { twoFactorAuthSecret: secret });

  await sendOtp(userId, 'enable 2FA');

  // generate QR code
  const otpAuthUrl = authenticator.keyuri(user.email, 'Defipay', secret);
  const qrCode = await QRCode.toDataURL(otpAuthUrl);
  return { qrCode, secret };
};

/**
 *
 * @param {string} userId
 * @param {string} twoFaCode
 * @returns {Promise<void>}
 * @throws {ApiError}
 * @throws {Error}
 *
 * @description This function will verify the 2FA code
 *
 */
const verify2faCode = async (userId, twoFaCode) => {
  const UserModel = await User();
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isValid = authenticator.verify({ token: twoFaCode, secret: user.twoFactorAuthSecret });
  if (!isValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid 2FA code');
  }
};

/**
 *
 * @param {string} userId
 * @param {string} otp
 * @param {string} twoFaCode
 * @returns {Promise<void>}
 * @throws {ApiError}
 * @throws {Error}
 *
 * @description This function will enable 2FA for the user
 *
 *
 */
const enable2fa = async (userId, otp, twoFaCode) => {
  const UserModel = await User();
  await validateOtp(userId, otp);
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isTwoFactorAuthEnabled) {
    throw new ApiError(httpStatus.BAD_REQUEST, '2FA already enabled');
  }

  const isValid = authenticator.verify({ token: twoFaCode, secret: user.twoFactorAuthSecret });
  if (!isValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid 2FA code');
  }

  await UserModel.updateOne({ _id: userId }, { isTwoFactorAuthEnabled: true });
};

/**
 *
 * @param {string} userId
 * @param {string} otp
 * @param {string} twoFaCode
 * @returns {Promise<void>}
 *
 * @description This function will disable 2FA for the user
 *
 */
const disable2fa = async (userId, otp, twoFaCode) => {
  const UserModel = await User();
  await validateOtp(userId, otp);

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isValid = authenticator.verify({ token: twoFaCode, secret: user.twoFactorAuthSecret });
  if (!isValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid 2FA code');
  }

  if (!user.isTwoFactorAuthEnabled) {
    throw new ApiError(httpStatus.BAD_REQUEST, '2FA not enabled');
  }

  await UserModel.updateOne({ _id: userId }, { isTwoFactorAuthEnabled: false });
};

module.exports = {
  sendOtp,
  validateOtp,
  enable2fa,
  init2fa,
  verify2faCode,
  disable2fa,
};
