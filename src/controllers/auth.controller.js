const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, securityService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password, otp } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password, otp);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const loginUser = catchAsync(async (req, res) => {
  const { identifier, password, otp } = req.body;
  const user = await authService.loginUser(identifier, password, otp);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  const { newPassword, confirmNewPassword } = req.body;
  await authService.resetPassword(req.query.otp, newPassword, confirmNewPassword);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { action } = 'Verify your accout';
  await securityService.sendOtp(userId, action);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  const { userId } = req.query;
  await authService.verifyEmail(userId, req.body.otp);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  loginUser,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
