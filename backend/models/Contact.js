const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  repliedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
