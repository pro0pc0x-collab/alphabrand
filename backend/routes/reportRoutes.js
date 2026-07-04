const express = require('express');
const router = express.Router();
const {
  generateOrderReportPDF,
  generateRevenueReportExcel,
  getAdvancedStats,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// جميع المسارات تتطلب تسجيل دخول وصلاحيات مدير
router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/orders/pdf', generateOrderReportPDF);
router.get('/revenue/excel', generateRevenueReportExcel);
router.get('/stats', getAdvancedStats);

module.exports = router;