const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// تحميل متغيرات البيئة
dotenv.config();

const app = express();

// ========================================
// ✅ تعريف المسار الصحيح لـ frontend
// ========================================
const frontendPath = path.resolve(__dirname, '../frontend');
console.log('📂 مسار frontend:', frontendPath);

// التحقق من وجود الملفات
const indexHtml = path.join(frontendPath, 'index.html');
if (fs.existsSync(indexHtml)) {
    console.log('✅ index.html موجود');
} else {
    console.error('❌ index.html غير موجود!');
}

// ========================================
// ✅ إعدادات CORS
// ========================================
app.use(cors({
    origin: [
        'https://alphabrand.vercel.app',
        'https://alphabrand.fly.dev',
        'http://localhost:5000'  // للتطوير المحلي
    ],
    credentials: true,
}));

// ========================================
// ✅ معالجة البيانات
// ========================================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// ========================================
// ✅ خدمة الملفات الثابتة
// ========================================
app.use(express.static(frontendPath));
app.use('/dashboard', express.static(path.join(__dirname, '../dashboard')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================================
// ✅ تحميل Passport (مهم جداً)
// ========================================
require('./config/passport');

// ========================================
// ✅ الاتصال بقاعدة البيانات
// ========================================
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => console.log('✅ تم الاتصال بقاعدة البيانات'))
    .catch(err => console.error('❌ فشل الاتصال بقاعدة البيانات:', err.message));

// ========================================
// ✅ استيراد المسارات
// ========================================
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const contactRoutes = require('./routes/contactRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// ========================================
// ✅ تعريف المسارات
// ========================================
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/upload', uploadRoutes);

// مسار Google OAuth (منفصل)
app.use('/auth', authRoutes);

// ========================================
// ✅ مسار الصفحة الرئيسية
// ========================================
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ========================================
// ✅ مسار لجميع صفحات HTML
// ========================================
app.get('*.html', (req, res) => {
    const frontendFile = path.join(frontendPath, req.path);
    const dashboardFile = path.join(__dirname, '../dashboard', req.path.replace(/^\/dashboard\//, ''));

    if (req.path.startsWith('/dashboard/') && fs.existsSync(dashboardFile)) {
        return res.sendFile(dashboardFile);
    }

    if (fs.existsSync(frontendFile)) {
        return res.sendFile(frontendFile);
    }

    res.status(404).send('الصفحة غير موجودة');
});

// ========================================
// ✅ معالج الأخطاء
// ========================================
app.use((err, req, res, next) => {
    console.error('❌ خطأ:', err.message);
    res.status(500).json({
        success: false,
        message: err.message
    });
});

// ========================================
// ✅ تشغيل الخادم
// ========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
    console.log(`📁 الموقع: http://localhost:${PORT}`);
    console.log(`📂 لوحة التحكم: http://localhost:${PORT}/dashboard/admin/dashboard.html`);
    console.log('📝 المسارات النشطة:');
    console.log('   - POST /api/auth/register');
    console.log('   - POST /api/auth/login');
    console.log('   - GET  /api/auth/google');
    console.log('   - POST /api/contact');
    console.log('   - POST /api/chatbot');
});
