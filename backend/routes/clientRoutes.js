const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/auth');

// ✅ جميع المسارات تتطلب تسجيل الدخول وصلاحيات مدير
router.use(protect);
router.use(authorize('admin', 'manager'));

// ✅ المسارات
router.get('/', clientController.getClients);
router.post('/', clientController.createClient);
router.get('/:id', clientController.getClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);
router.get('/:id/orders', clientController.getClientOrders);

module.exports = router;