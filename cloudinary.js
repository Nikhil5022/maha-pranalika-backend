// cloudinary.js - CORRECT VERSION
const cloudinary = require('cloudinary').v2;
require('dotenv').config();


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test the configuration
console.log('Cloudinary Config Test:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test the connection
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connected successfully:', result);
  })
  .catch(error => {
    console.error('❌ Cloudinary connection failed:', error.message);
  });

module.exports = cloudinary;