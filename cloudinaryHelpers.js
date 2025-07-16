const cloudinary = require('cloudinary').v2;

// Extract Cloudinary public ID from URL
function getPublicIdFromUrl(url) {
  if (!url) return null;
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;

  // remove version (v123...) & extension
  let publicIdWithVersion = parts[1];
  const versionRemoved = publicIdWithVersion.replace(/v[0-9]+\//, '');
  return versionRemoved.replace(/\.[^/.]+$/, '');
}

// ✅ Delete a single file from Cloudinary
async function deleteFileFromCloudinary(url) {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) {
    console.warn(`⚠️ Could not extract public ID from URL: ${url}`);
    return;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
    console.log(`✅ Deleted from Cloudinary: ${publicId}`, result);
    return result;
  } catch (err) {
    console.error(`❌ Failed to delete ${publicId}:`, err.message);
    throw err;
  }
}

module.exports = { deleteFileFromCloudinary };
