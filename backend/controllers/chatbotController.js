const { getChatbotReply } = require('../config/gemini');

// ✅ إرسال رسالة والحصول على رد
exports.sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'الرسالة مطلوبة'
      });
    }

    // الحصول على رد من Gemini
    const reply = await getChatbotReply(message);
    
    if (!reply) {
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ في معالجة الرسالة'
      });
    }

    res.status(200).json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    next(err);
  }
};

// ✅ الحصول على تاريخ المحادثات (للمدير)
exports.getHistory = async (req, res, next) => {
  try {
    // يمكنك استرجاع المحادثات من قاعدة البيانات هنا
    res.status(200).json({
      success: true,
      history: []
    });
  } catch (err) {
    next(err);
  }
};