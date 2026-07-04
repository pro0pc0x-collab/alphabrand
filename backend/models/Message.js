const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  subject: { type: String },
  content: { type: String, required: true },
  attachments: [{ name: String, url: String }],
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  type: { type: String, enum: ['message', 'notification', 'system'], default: 'message' },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);