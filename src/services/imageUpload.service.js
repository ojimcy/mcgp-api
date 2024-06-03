const cloudinary = require('../utils/cloudinary');

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'mcgp',
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Failed to upload image');
  }
};

const uploadImages = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }
  return Promise.all(files.map((file) => uploadImage(file.path)));
};

module.exports = {
  uploadImage,
  uploadImages,
};
