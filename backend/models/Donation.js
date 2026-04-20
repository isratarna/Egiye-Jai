const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  donationType: {
    type: String,
    enum: ['one-time', 'recurring'],
    default: 'one-time'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  donorName: String,
  donorEmail: String,
  message: String,
  isAnonymous: {
    type: Boolean,
    default: false
  },
  purpose: {
    type: String,
    enum: ['general', 'emergency', 'project'],
    default: 'general'
  },
  receiptUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', donationSchema);
