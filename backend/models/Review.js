const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true },
  language: { type: String, enum: ['ar', 'fr', 'en'], default: 'ar' },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);