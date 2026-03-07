const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Education', 'Environment', 'Healthcare', 'Food Relief', 'Elderly Care', 'Animal Rescue', 'Disaster Relief', 'Community', 'Other']
  },
  organization: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  spots: { type: Number, required: true, min: 1 },
  spotsRemaining: { type: Number },
  image: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  color: { type: String, default: '#3d8b7a' },
  requirements: [{ type: String }],
  benefits: [{ type: String }],
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicationsCount: { type: Number, default: 0 },
}, { timestamps: true });

opportunitySchema.pre('save', function(next) {
  if (this.isNew) {
    this.spotsRemaining = this.spots;
  }
  next();
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
