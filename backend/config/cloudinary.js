const cloudinary = require('cloudinary').v2;

// تهيئة Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// دالة رفع ملف إلى Cloudinary
const uploadFile = async (file, folder = 'digital-agency') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto',
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    console.error('❌ خطأ في رفع الملف:', error.message);
    throw error;
  }
};

// دالة حذف ملف من Cloudinary
const deleteFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('❌ خطأ في حذف الملف:', error.message);
    return false;
  }
};

module.exports = { cloudinary, uploadFile, deleteFile };