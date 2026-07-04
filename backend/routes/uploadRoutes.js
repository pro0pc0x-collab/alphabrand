const express = require('express');
const router = express.Router();
const {
  uploadSingleFile,
  uploadMultipleFiles,
  getFiles,
  getFile,
  deleteFile,
} = require('../controllers/fileController');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

// جميع المسارات تتطلب تسجيل دخول وصلاحيات مدير
router.use(protect);
router.use(authorize('admin', 'manager'));

// رفع ملفات
router.post('/single', uploadSingle('file'), uploadSingleFile);
router.post('/multiple', uploadMultiple('files', 10), uploadMultipleFiles);

// إدارة الملفات
router.get('/', getFiles);
router.get('/:id', getFile);
router.delete('/:id', deleteFile);

module.exports = router;