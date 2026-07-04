const { body, validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'خطأ في البيانات المدخلة',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

exports.registerRules = [
  body('name').trim().notEmpty().withMessage('الاسم مطلوب').isLength({ min: 2, max: 50 }),
  body('email').isEmail().withMessage('بريد إلكتروني غير صالح').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  body('phone').optional().isMobilePhone().withMessage('رقم هاتف غير صالح'),
];

exports.loginRules = [
  body('email').isEmail().withMessage('بريد إلكتروني غير صالح'),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
];

exports.orderRules = [
  body('serviceType').notEmpty().withMessage('نوع الخدمة مطلوب'),
  body('title').trim().notEmpty().withMessage('عنوان المشروع مطلوب'),
  body('description').trim().isLength({ min: 20 }).withMessage('وصف المشروع يجب أن يكون 20 حرف على الأقل'),
];

exports.contactRules = [
  body('name').trim().notEmpty().withMessage('الاسم مطلوب'),
  body('email').isEmail().withMessage('بريد إلكتروني غير صالح'),
  body('subject').trim().notEmpty().withMessage('الموضوع مطلوب'),
  body('message').trim().isLength({ min: 10 }).withMessage('الرسالة يجب أن تكون 10 أحرف على الأقل'),
];