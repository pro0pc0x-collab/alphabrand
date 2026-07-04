const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ التحقق من التوكن
const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح بالدخول، يرجى تسجيل الدخول'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'رمز غير صالح أو منتهي الصلاحية'
    });
  }
};

// ✅ التحقق من الصلاحيات
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح بالدخول'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `الدور ${req.user.role} غير مخول للقيام بهذه العملية`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };