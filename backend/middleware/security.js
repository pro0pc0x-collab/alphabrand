const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// ========================================
// 1. حماية الرؤوس (Helmet)
// ========================================
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://*.google.com", "https://*.googleapis.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

// ========================================
// 2. الحد من الطلبات (Rate Limiting)
// ========================================
const limiter = rateLimit({
  windowMs: 1 * 1 * 1, // 15 دقيقة
  max: 1000, // 100 طلب لكل IP
  message: {
    success: false,
    message: 'عدد الطلبات تجاوز الحد، حاول بعد 15 دقيقة'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ========================================
// 3. منع هجمات XSS
// ========================================
const xssClean = xss();

// ========================================
// 4. منع هجمات NoSQL Injection
// ========================================
const sanitize = mongoSanitize();

// ========================================
// 5. منع هجمات Parameter Pollution
// ========================================
const hppProtect = hpp({
  whitelist: [
    'status', 'priority', 'category', 'price',
    'createdAt', 'isActive', 'isFeatured'
  ]
});

// ========================================
// 6. التحقق من الـ Origin (CORS محدد)
// ========================================
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// ========================================
// 7. تصدير الكل
// ========================================
module.exports = {
  securityHeaders,
  limiter,
  xssClean,
  sanitize,
  hppProtect,
  corsOptions,
};