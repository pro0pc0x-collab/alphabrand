const errorHandler = (err, req, res, next) => {
  console.error('❌ خطأ:', err.stack);

  // خطأ في MongoDB
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'معرف غير صحيح',
    });
  }

  // خطأ تكرار في MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} مستخدم مسبقاً`,
    });
  }

  // خطأ التحقق من الصحة
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      messages,
    });
  }

  // خطأ JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'رمز غير صالح',
    });
  }

  // أي خطأ آخر
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حدث خطأ في الخادم',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;