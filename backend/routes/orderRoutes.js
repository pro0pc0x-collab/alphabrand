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
router.use(authorize('admin', 'manager'));

router.get('/stats', authorize('admin'), getStats);
router.get('/', authorize('admin'), getAllOrders);
router.get('/my', getMyOrders);
router.get('/:id', getOrder);
router.post('/', orderRules, validate, upload.array('attachments', 5), createOrder);
router.put('/:id/status', authorize('admin'), updateOrderStatus);
router.post('/:id/quotation', authorize('admin'), sendQuotation);
router.put('/:id/accept-quotation', acceptQuotation);

module.exports = router;