const {
  createStripePayment,
  confirmStripePayment,
  createPayPalPayment,
  executePayPalPayment,
} = require('../config/payment');
const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const { sendPaymentConfirmation } = require('../config/mail');

// ========================================
// إنشاء دفع (Stripe)
// ========================================
exports.createStripePayment = async (req, res, next) => {
  try {
    const { invoiceId, amount, currency, description } = req.body;
    
    const invoice = await Invoice.findById(invoiceId).populate('client');
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'الفاتورة غير موجودة'
      });
    }
    
    const result = await createStripePayment(
      amount || invoice.total,
      currency || invoice.currency,
      description || `الفاتورة #${invoice.invoiceNumber}`,
      { invoiceId: invoice._id.toString() }
    );
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }
    
    res.status(200).json({
      success: true,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
    });
  } catch (err) {
    next(err);
  }
};

// ========================================
// تأكيد دفع (Stripe)
// ========================================
exports.confirmStripePayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;
    
    const result = await confirmStripePayment(paymentIntentId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }
    
    // إذا تم الدفع بنجاح
    if (result.status === 'succeeded') {
      // تحديث حالة الفاتورة
      const invoice = await Invoice.findOne({ 
        _id: result.paymentIntent.metadata.invoiceId 
      }).populate('client');
      
      if (invoice) {
        invoice.status = 'paid';
        invoice.paidDate = Date.now();
        await invoice.save();
        
        // إرسال تأكيد بالبريد
        await sendPaymentConfirmation(invoice, invoice.client);
      }
    }
    
    res.status(200).json({
      success: true,
      status: result.status,
    });
  } catch (err) {
    next(err);
  }
};

// ========================================
// إنشاء دفع (PayPal)
// ========================================
exports.createPayPalPayment = async (req, res, next) => {
  try {
    const { invoiceId, amount, currency, description } = req.body;
    
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'الفاتورة غير موجودة'
      });
    }
    
    const result = await createPayPalPayment(
      amount || invoice.total,
      currency || invoice.currency,
      description || `الفاتورة #${invoice.invoiceNumber}`,
      `${process.env.FRONTEND_URL}/payment-success`,
      `${process.env.FRONTEND_URL}/payment-cancel`
    );
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }
    
    res.status(200).json({
      success: true,
      paymentId: result.paymentId,
      approvalUrl: result.approvalUrl,
    });
  } catch (err) {
    next(err);
  }
};

// ========================================
// تنفيذ دفع (PayPal)
// ========================================
exports.executePayPalPayment = async (req, res, next) => {
  try {
    const { paymentId, payerId } = req.body;
    
    const result = await executePayPalPayment(paymentId, payerId);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error
      });
    }
    
    // تحديث الفاتورة
    const invoice = await Invoice.findOne({
      _id: result.payment.transactions[0].item_list.items[0].sku
    }).populate('client');
    
    if (invoice) {
      invoice.status = 'paid';
      invoice.paidDate = Date.now();
      await invoice.save();
      
      await sendPaymentConfirmation(invoice, invoice.client);
    }
    
    res.status(200).json({
      success: true,
      payment: result.payment,
    });
  } catch (err) {
    next(err);
  }
};