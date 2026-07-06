const mongoose = require('mongoose');

const localizedString = {
  ar: { type: String, required: true },
  fr: { type: String },
  en: { type: String },
};

const OrderSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  serviceType: { type: String, required: true, trim: true },
  orderNumber: { type: String, unique: true },
  title: localizedString,
  description: { ar: { type: String, required: true }, fr: { type: String }, en: { type: String } },
  status: { type: String, enum: ['pending', 'quoted', 'in_progress', 'review', 'completed', 'delivered', 'cancelled'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  price: { type: Number, default: 0 },
  budget: Number,
  currency: { type: String, default: 'MAD' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'partial', 'refunded'], default: 'pending' },
  startDate: { type: Date, default: Date.now },
  dueDate: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  completedDate: Date,
  deadline: Date,
  notes: String,
  attachments: [{ name: String, url: String, public_id: String, size: Number }],
  quotation: { amount: Number, validUntil: Date, notes: String, accepted: { type: Boolean, default: false }, acceptedAt: Date },
  timeline: [{ status: String, date: { type: Date, default: Date.now }, note: String, updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = 'ORD-' + String(count + 1).padStart(5, '0');
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
