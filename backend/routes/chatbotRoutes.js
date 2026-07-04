const express = require('express');
const router = express.Router();
const { sendMessage, getHistory } = require('../controllers/chatbotController');
const { protect } = require('../middleware/auth');

// ✅ مسار إرسال رسالة للبوت (عام)
router.post('/', sendMessage);

// ✅ مسار الحصول على تاريخ المحادثات (محمي)
router.get('/history', protect, getHistory);

module.exports = router;