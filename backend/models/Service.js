const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    ar: { type: String, required: [true, 'العنوان بالعربية مطلوب'] },
    fr: { type: String },
    en: { type: String },
  },
  description: {
    ar: { type: String, required: [true, 'الوصف بالعربية مطلوب'] },
    fr: { type: String },
    en: { type: String },
  },
  icon: { 
    type: String, 
    default: '🚀',
    validate: {
      validator: function(v) {
        return v.length <= 5; // يجب أن يكون إيموجي واحد
      },
      message: 'الرمز يجب أن يكون إيموجي واحد فقط'
    }
  },
  image: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v); // التحقق من الرابط
      },
      message: 'رابط الصورة غير صحيح'
    }
  },
  category: {
    type: String,
    enum: {
      values: ['apps', 'websites', 'marketing', 'design', 'advertising', 'drone', 'branding', 'social'],
      message: 'الفئة غير مدعومة'
    },
    required: [true, 'الفئة مطلوبة'],
  },
  basePrice: { 
    type: Number, 
    required: [true, 'السعر الأساسي مطلوب'],
    min: [0, 'السعر لا يمكن أن يكون سالباً'],
  },
  maxPrice: { 
    type: Number,
    min: [0, 'السعر لا يمكن أن يكون سالباً'],
    validate: {
      validator: function(v) {
        return !v || v >= this.basePrice;
      },
      message: 'الحد الأقصى يجب أن يكون أكبر من السعر الأساسي'
    }
  },
  currency: { 
    type: String, 
    default: 'MAD',
    enum: ['MAD', 'USD', 'EUR', 'AED'],
  },
  duration: { 
    type: String,
    default: 'أسبوعين'
  },
  features: [{
    ar: { type: String, required: true },
    fr: { type: String },
    en: { type: String },
  }],
  isActive: { 
    type: Boolean, 
    default: true,
    index: true, // للبحث السريع
  },
  isFeatured: { 
    type: Boolean, 
    default: false,
    index: true,
  },
  order: { type: Number, default: 0 },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ✅ إضافة خاصية افتراضية: عدد المشاريع في البورتفوليو
serviceSchema.virtual('portfolioCount', {
  ref: 'Portfolio',
  localField: '_id',
  foreignField: 'services',
  count: true,
});

// ✅ إضافة خاصية افتراضية: السعر كـ String مع العملة
serviceSchema.virtual('formattedPrice').get(function() {
  return `${this.basePrice} ${this.currency}`;
});

module.exports = mongoose.model('Service', serviceSchema);