const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ========================================
// إنشاء التوكن
// ========================================
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '30d' }
    );
};

// ========================================
// إرسال التوكن في الاستجابة
// ========================================
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);
    
    res.cookie('token', token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    
    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive,
        }
    });
};

// ========================================
// التسجيل
// ========================================
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'البريد الإلكتروني مستخدم مسبقاً'
            });
        }

        const user = await User.create({ name, email, password, phone });
        sendTokenResponse(user, 201, res);

    } catch (err) {
        next(err);
    }
};

// ========================================
// تسجيل الدخول
// ========================================
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'الحساب معطل'
            });
        }

        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        sendTokenResponse(user, 200, res);

    } catch (err) {
        next(err);
    }
};

// ========================================
// تسجيل الخروج
// ========================================
exports.logout = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: 'تم تسجيل الخروج بنجاح'
        });
    } catch (err) {
        next(err);
    }
};

// ========================================
// الحصول على بيانات المستخدم الحالي
// ========================================
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        next(err);
    }
};

// ========================================
// تصدير generateToken للاستخدام في routes
// ========================================
exports.generateToken = generateToken;