const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: { 
    type: String, 
    required: true,
    enum: ['Dhaka', 'Rajshahi', 'Sylhet', 'Chittagong', 'Barisal', 'Khulna', 'Rangpur'] 
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  status: { 
    type: String, 
    enum: ['Submitted', 'Verified', 'In Progress', 'Resolved'], 
    default: 'Submitted' 
  }
  
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
