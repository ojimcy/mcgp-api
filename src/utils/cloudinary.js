const cloudinary = require('cloudinary').v2;
const { cloudinary: cloudinaryConfig } = require('../config/config');

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
});

module.exports = cloudinary;
