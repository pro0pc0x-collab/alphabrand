const Client = require('../models/Client');
const User = require('../models/User');
const Order = require('../models/Order');

// ✅ الحصول على جميع العملاء
exports.getClients = async (req, res, next) => {
  try {
    const clients = await Client.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      clients
    });
  } catch (err) {
    next(err);
  }
};

// ✅ الحصول على عميل واحد
exports.getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'العميل غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      client
    });
  } catch (err) {
    next(err);
  }
};

// ✅ إنشاء عميل جديد
exports.createClient = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    const existingClient = await Client.findOne({ email: req.body.email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مستخدم مسبقاً'
      });
    }

    const client = await Client.create(req.body);

    res.status(201).json({
      success: true,
      client
    });
  } catch (err) {
    next(err);
  }
};

// ✅ تحديث عميل
exports.updateClient = async (req, res, next) => {
  try {
    let client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'العميل غير موجود'
      });
    }

    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      client
    });
  } catch (err) {
    next(err);
  }
};

// ✅ حذف عميل
exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'العميل غير موجود'
      });
    }

    await client.deleteOne();

    res.status(200).json({
      success: true,
      message: 'تم حذف العميل بنجاح'
    });
  } catch (err) {
    next(err);
  }
};

// ✅ الحصول على طلبات العميل
exports.getClientOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ client: req.params.id })
      .populate('service', 'title basePrice')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};