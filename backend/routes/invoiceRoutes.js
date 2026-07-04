const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice
} = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/auth');

// جميع المسارات تتطلب تسجيل دخول وصلاحيات مدير
router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.post('/', createInvoice);
router.put('/:id/status', updateInvoiceStatus);
router.delete('/:id', deleteInvoice);

module.exports = router;