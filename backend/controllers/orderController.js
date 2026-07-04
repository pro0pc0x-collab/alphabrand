const Order = require('../models/Order');
const ActivityLog = require('../models/ActivityLog');
const sendEmail = require('../utils/sendEmail');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.createOrder = async (req, res, next) => {
  try {
    const { serviceType, title, description, budget, deadline } = req.body;

    const orderData = {
      client: req.user._id,
      serviceType,
      title,
      description,
      budget: budget ? Number(budget) : undefined,
      deadline: deadline ? new Date(deadline) : undefined,
      timeline: [{ status: 'pending', note: 'تم إنشاء الطلب', updatedBy: req.user._id }],
    };

    if (req.files?.length) {
      const uploads = await Promise.all(
        req.files.map(f => uploadToCloudinary(f.path, 'orders'))
      );
      orderData.attachments = uploads.map((u, i) => ({
        name: req.files[i].originalname,
        url: u.url,
        public_id: u.public_id,
        size: req.files[i].size,
      }));
    }

    const order = await Order.create(orderData);
    await order.populate('client', 'name email phone');

    await ActivityLog.create({
      user: req.user._id,
      action: 'CREATE_ORDER',
      resource: 'Order',
      resourceId: order._id,
      details: { orderNumber: order.orderNumber },
    });

    sendEmail({
      to: req.user.email,
      templateName: 'orderConfirmation',
      templateData: [order, req.user],
    });

    sendEmail({
      to: process.env.ADMIN_EMAIL,
      templateName: 'newOrderAdmin',
      templateData: [order, req.user],
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { client: req.user._id };
    if (status) query.status = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('service', 'title')
        .sort('-createdAt')
        .limit(limit * 1)
        .skip((page - 1) * limit),
      Order.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      orders,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate('service');

    if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });

    if (req.user.role !== 'admin' && order.client._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'غير مصرح' });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const query = {};
    if (status) query.status = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('client', 'name email phone')
        .populate('service', 'title')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit),
      Order.countDocuments(query),
    ]);

    res.status(200).json({ success: true, count: orders.length, total, pages: Math.ceil(total / limit), orders });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });

    order.status = status;
    if (status === 'delivered') order.deliveredAt = Date.now();
    order.timeline.push({ status, note: note || `تم تحديث الحالة إلى: ${status}`, updatedBy: req.user._id });
    await order.save();

    await ActivityLog.create({
      user: req.user._id,
      action: 'UPDATE_ORDER_STATUS',
      resource: 'Order',
      resourceId: order._id,
      details: { status, orderNumber: order.orderNumber },
    });

    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

exports.sendQuotation = async (req, res, next) => {
  try {
    const { amount, validUntil, notes } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        quotation: { amount, validUntil, notes },
        status: 'quoted',
        $push: { timeline: { status: 'quoted', note: `تم إرسال عرض السعر: ${amount} درهم`, updatedBy: req.user._id } },
      },
      { new: true }
    ).populate('client', 'name email');

    if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

exports.acceptQuotation = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    if (order.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'غير مصرح' });
    }
    order.quotation.accepted = true;
    order.quotation.acceptedAt = Date.now();
    order.status = 'in_progress';
    order.timeline.push({ status: 'in_progress', note: 'تم قبول عرض السعر', updatedBy: req.user._id });
    await order.save();
    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const [total, pending, inProgress, completed, revenue] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'in_progress' }),
      Order.countDocuments({ status: { $in: ['completed', 'delivered'] } }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$quotation.amount' } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        completed,
        revenue: revenue[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};