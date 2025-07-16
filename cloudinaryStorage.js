const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fileName = file.originalname.replace(/\.[^/.]+$/, '');
    const sanitizedPublicId = fileName.replace(/[^a-zA-Z0-9-_]/g, '_');

    return {
      resource_type: 'auto', 
      folder: 'firms',
      public_id: `${Date.now()}-${sanitizedPublicId}`,
    };
  },
});

module.exports = storage;
