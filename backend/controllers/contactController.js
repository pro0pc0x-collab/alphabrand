const Contact = require('../models/Contact');

// ✅ إرسال رسالة جديدة
exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, service } = req.body;

    // التحقق من الحقول المطلوبة
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة'
      });
    }

    // حفظ الرسالة في قاعدة البيانات
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      service,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.status(201).json({
      success: true,
      message: 'تم إرسال الرسالة بنجاح',
      data: contact
    });
  } catch (err) {
    next(err);
  }
};

// ✅ الحصول على جميع الرسائل (للمدير)
exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (err) {
    next(err);
  }
};

// ✅ الحصول على رسالة واحدة
exports.getMessage = async (req, res, next) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }

    res.status(200).json({
      success: true,
      message
    });
  } catch (err) {
    next(err);
  }
};

// ✅ الرد على رسالة
exports.replyMessage = async (req, res, next) => {
  try {
    const { reply } = req.body;
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }

    if (!reply) {
      return res.status(400).json({
        success: false,
        message: 'نص الرد مطلوب'
      });
    }

    message.status = 'replied';
    message.repliedAt = Date.now();
    message.notes = reply;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'تم الرد على الرسالة بنجاح',
      data: message
    });
  } catch (err) {
    next(err);
  }
};

// ✅ حذف رسالة
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'الرسالة غير موجودة'
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'تم حذف الرسالة بنجاح'
    });
  } catch (err) {
    next(err);
  }
};