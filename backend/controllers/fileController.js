const fs = require('fs');
const path = require('path');
const { uploadFile, deleteFile } = require('../config/cloudinary');
const File = require('../models/File');

// ✅ رفع ملف واحد
exports.uploadSingleFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء اختيار ملف للرفع'
      });
    }

    // رفع إلى Cloudinary
    const result = await uploadFile(req.file, req.body.folder || 'digital-agency');

    // حفظ في قاعدة البيانات
    const file = await File.create({
      filename: req.file.originalname,
      originalName: req.file.originalname,
      url: result.url,
      publicId: result.public_id,
      format: result.format,
      size: result.size,
      mimeType: req.file.mimetype,
      folder: req.body.folder || 'digital-agency',
      uploadedBy: req.user.id,
      orderId: req.body.orderId || null,
    });

    // حذف الملف المحلي
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      file,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ رفع ملفات متعددة
exports.uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء اختيار ملفات للرفع'
      });
    }

    const uploadedFiles = [];
    for (const file of req.files) {
      const result = await uploadFile(file, req.body.folder || 'digital-agency');
      
      const fileDoc = await File.create({
        filename: file.originalname,
        originalName: file.originalname,
        url: result.url,
        publicId: result.public_id,
        format: result.format,
        size: result.size,
        mimeType: file.mimetype,
        folder: req.body.folder || 'digital-agency',
        uploadedBy: req.user.id,
        orderId: req.body.orderId || null,
      });
      
      uploadedFiles.push(fileDoc);
      fs.unlinkSync(file.path);
    }

    res.status(201).json({
      success: true,
      count: uploadedFiles.length,
      files: uploadedFiles,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ الحصول على جميع الملفات
exports.getFiles = async (req, res, next) => {
  try {
    const files = await File.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: files.length,
      files,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ الحصول على ملف واحد
exports.getFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id)
      .populate('uploadedBy', 'name email');
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'الملف غير موجود'
      });
    }
    
    res.status(200).json({
      success: true,
      file,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ حذف ملف
exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'الملف غير موجود'
      });
    }
    
    // حذف من Cloudinary
    await deleteFile(file.publicId);
    
    // حذف من قاعدة البيانات
    await file.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'تم حذف الملف بنجاح',
    });
  } catch (err) {
    next(err);
  }
};