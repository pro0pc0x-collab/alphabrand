const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const Client = require('../models/Client');

// ✅ الحصول على جميع الفواتير
exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find()
      .populate('client', 'name email phone')
      .populate('order', 'title orderNumber')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: invoices.length,
      invoices
    });
  } catch (err) {
    next(err);
  }
};

// ✅ الحصول على فاتورة واحدة
exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client', 'name email phone address')
      .populate('order', 'title orderNumber');
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'الفاتورة غير موجودة'
      });
    }
    
    res.status(200).json({
      success: true,
      invoice
    });
  } catch (err) {
    next(err);
  }
};

// ✅ إنشاء فاتورة جديدة من طلب
exports.createInvoice = async (req, res, next) => {
  try {
    const { orderId, dueDate, notes, items } = req.body;
    
    const order = await Order.findById(orderId).populate('client');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }
    
    // إنشاء الفاتورة
    const invoice = await Invoice.create({
      client: order.client._id,
      order: orderId,
      items: items || [{
        description: order.title.ar || 'خدمة',
        quantity: 1,
        unitPrice: order.price,
        total: order.price,
      }],
      subtotal: order.price,
      total: order.price,
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes,
      createdBy: req.user.id
    });
    
    // تحديث حالة الطلب
    order.paymentStatus = 'pending';
    await order.save();
    
    res.status(201).json({
      success: true,
      invoice
    });
  } catch (err) {
    next(err);
  }
};

// ✅ تحديث حالة الفاتورة (دفع)
exports.updateInvoiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'الفاتورة غير موجودة'
      });
    }
    
    invoice.status = status;
    if (status === 'paid') {
      invoice.paidDate = Date.now();
    }
    await invoice.save();
    
    res.status(200).json({
      success: true,
      invoice
    });
  } catch (err) {
    next(err);
  }
};

// ✅ حذف فاتورة
exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'الفاتورة غير موجودة'
      });
    }
    
    await invoice.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'تم حذف الفاتورة بنجاح'
    });
  } catch (err) {
    next(err);
  }
};