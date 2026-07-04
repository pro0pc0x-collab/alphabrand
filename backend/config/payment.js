const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('paypal-rest-sdk');

// تهيئة PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

// ========================================
// Stripe - إنشاء دفع
// ========================================
const createStripePayment = async (amount, currency, description, metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // تحويل إلى سنتات
      currency: currency || 'mad',
      description: description,
      metadata: metadata,
      payment_method_types: ['card'],
    });
    
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('❌ Stripe error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ========================================
// Stripe - تأكيد الدفع
// ========================================
const confirmStripePayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      status: paymentIntent.status,
      paymentIntent,
    };
  } catch (error) {
    console.error('❌ Stripe confirm error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// ========================================
// PayPal - إنشاء دفع
// ========================================
const createPayPalPayment = async (amount, currency, description, returnUrl, cancelUrl) => {
  return new Promise((resolve, reject) => {
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: returnUrl || `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment-cancel`,
      },
      transactions: [{
        item_list: {
          items: [{
            name: description || 'خدمة',
            sku: '001',
            price: amount,
            currency: currency || 'MAD',
            quantity: 1,
          }],
        },
        amount: {
          currency: currency || 'MAD',
          total: amount,
        },
        description: description || 'دفع مقابل خدمات Digital Agency',
      }],
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.error('❌ PayPal error:', error);
        resolve({ success: false, error: error.message });
      } else {
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
        resolve({
          success: true,
          paymentId: payment.id,
          approvalUrl: approvalUrl ? approvalUrl.href : null,
        });
      }
    });
  });
};

// ========================================
// PayPal - تنفيذ الدفع
// ========================================
const executePayPalPayment = async (paymentId, payerId) => {
  return new Promise((resolve, reject) => {
    const execute_payment_json = {
      payer_id: payerId,
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if (error) {
        console.error('❌ PayPal execute error:', error);
        resolve({ success: false, error: error.message });
      } else {
        resolve({
          success: true,
          payment,
        });
      }
    });
  });
};

module.exports = {
  createStripePayment,
  confirmStripePayment,
  createPayPalPayment,
  executePayPalPayment,
};