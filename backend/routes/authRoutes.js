const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { register, login, logout, getMe, updateMe, generateToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ========================================
// المسارات العادية
// ========================================
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update', protect, updateMe);
router.post('/update', protect, updateMe);

// ========================================
// ✅ مسار Google (تسجيل الدخول بجوجل)
// ========================================
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        session: false
    })
);

// ========================================
// ✅ مسار العودة من Google
// ========================================
router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login.html?error=auth_failed',
        session: false
    }),
    (req, res) => {
        try {
            console.log('✅ المستخدم بعد المصادقة:', req.user.email);
            
            const token = jwt.sign(
                { 
                    id: req.user._id, 
                    email: req.user.email, 
                    name: req.user.name 
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '30d' }
            );
            
            console.log('✅ تم إنشاء التوكن');
            res.redirect(`http://localhost:5000/login.html?token=${token}`);
        } catch (error) {
            console.error('❌ خطأ في إنشاء التوكن:', error.message);
            res.redirect('/login.html?error=token_failed');
        }
    }
);

module.exports = router;