const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'البريد الإلكتروني غير صحيح'],
  },
  phone: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'الموضوع مطلوب'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'الرسالة مطلوبة'],
    trim: true,
  },
  service: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  ip: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  notes: {
    type: String,
  },
  repliedAt: {
    type: Date,
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// إضافة فهرس للبحث السريع
ContactSchema.index({ email: 1, status: 1, createdAt: -1 });
ContactSchema.index({ status: 1, priority: 1 });

module.exports = mongoose.model('Contact', ContactSchema);