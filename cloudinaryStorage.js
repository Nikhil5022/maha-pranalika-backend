const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  // resource_type must be 'auto' so Cloudinary decides based on file type
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';

    const extension = isPDF ? 'pdf' : file.mimetype === 'image/png' ? 'png' : 'jpg';
    const fileName = file.originalname.replace(/\.[^/.]+$/, ''); // remove original extension
    const sanitizedPublicId = fileName.replace(/[^a-zA-Z0-9-_]/g, '_');

    return {
      resource_type: 'auto', // let Cloudinary decide based on file mimetype
      folder: 'firms',
      public_id: `${Date.now()}-${sanitizedPublicId}`, // extension handled via format
      format: extension,
    };
  },
});

module.exports = storage;
