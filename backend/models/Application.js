const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  motivation: { type: String, required: true },
  experience: { type: String, default: '' },
  availability: { type: String, required: true },
  hoursLogged: { type: Number, default: 0 },
  adminNote: { type: String, default: '' },
  appliedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

applicationSchema.index({ user: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
