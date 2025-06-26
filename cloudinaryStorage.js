const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';

    return {
      resource_type: isPDF ? 'raw' : 'image',
      folder: 'firms',
      allowed_formats: ['jpg', 'png', 'pdf'],
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

module.exports = storage;
