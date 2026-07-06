const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrder,
  getAllOrders, updateOrderStatus, sendQuotation,
  acceptQuotation, getStats,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { orderRules, validate } = require('../utils/validators');

router.use(protect);

// Client routes
router.post('/', orderRules, validate, upload.array('attachments', 5), createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/accept-quotation', acceptQuotation);

// Admin / manager routes
router.get('/admin/stats', authorize('admin'), getStats);
router.get('/admin/all', authorize('admin', 'manager'), getAllOrders);
router.put('/:id/status', authorize('admin', 'manager'), updateOrderStatus);
router.post('/:id/quotation', authorize('admin', 'manager'), sendQuotation);

module.exports = router;
