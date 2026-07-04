const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getMessage,
  replyMessage,
  deleteMessage
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// ✅ مسار إرسال الرسالة (عام - لا يحتاج تسجيل دخول)
router.post('/', sendMessage);

// ✅ جميع المسارات التالية تتطلب تسجيل الدخول وصلاحيات مدير
router.get('/', protect, authorize('admin', 'manager'), getMessages);
router.get('/:id', protect, authorize('admin', 'manager'), getMessage);
router.post('/:id/reply', protect, authorize('admin', 'manager'), replyMessage);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteMessage);

module.exports = router;