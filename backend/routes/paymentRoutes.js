const express = require('express');
const router = express.Router();
const {
  createStripePayment,
  confirmStripePayment,
  createPayPalPayment,
  executePayPalPayment,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// جميع المسارات تتطلب تسجيل دخول
router.use(protect);

// Stripe
router.post('/stripe/create', createStripePayment);
router.post('/stripe/confirm', confirmStripePayment);

// PayPal
router.post('/paypal/create', createPayPalPayment);
router.post('/paypal/execute', executePayPalPayment);

module.exports = router;