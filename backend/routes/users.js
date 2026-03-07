const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

// GET /api/users/profile - get own profile with stats
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const applications = await Application.find({ user: req.user._id })
      .populate('opportunity', 'title category location duration image organization');

    const stats = {
      totalApplications: applications.length,
      pending: applications.filter(a => a.status === 'pending').length,
      approved: applications.filter(a => a.status === 'approved').length,
      completed: applications.filter(a => a.status === 'completed').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      totalHours: applications.reduce((sum, a) => sum + (a.hoursLogged || 0), 0),
    };

    res.json({ success: true, user: user.toPublic(), applications, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/profile - update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, location, bio, skills, interests } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, location, bio, skills, interests },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/users/avatar - upload avatar
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const result = await uploadToCloudinary(req.file.buffer, 'egiyejai/avatars', `user_${req.user._id}`);
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: result.secure_url }, { new: true });
    res.json({ success: true, avatar: result.secure_url, user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
