const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/dashboard - full analytics
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalVolunteers,
      totalOpportunities,
      totalApplications,
      pendingApplications,
      approvedApplications,
      completedApplications,
      unreadMessages,
      recentUsers,
      recentApps,
    ] = await Promise.all([
      User.countDocuments({ role: 'volunteer' }),
      Opportunity.countDocuments({ isActive: true }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'completed' }),
      Contact.countDocuments({ isRead: false }),
      User.find({ role: 'volunteer' }).sort({ createdAt: -1 }).limit(5).select('name email avatar createdAt'),
      Application.find().sort({ createdAt: -1 }).limit(5)
        .populate('user', 'name avatar')
        .populate('opportunity', 'title category'),
    ]);

    // Monthly signups for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlySignups = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, role: 'volunteer' } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Category breakdown
    const categoryStats = await Opportunity.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Total volunteer hours
    const hoursResult = await Application.aggregate([
      { $group: { _id: null, total: { $sum: '$hoursLogged' } } }
    ]);
    const totalHours = hoursResult[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalVolunteers, totalOpportunities, totalApplications,
        pendingApplications, approvedApplications, completedApplications,
        unreadMessages, totalHours
      },
      recentUsers,
      recentApps,
      monthlySignups,
      categoryStats,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/users/:id/toggle - activate/deactivate
router.patch('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot deactivate admin' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user: user.toPublic() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin' });
    await Application.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User and their applications deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/applications
router.get('/applications', async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const total = await Application.countDocuments(filter);
    const applications = await Application.find(filter)
      .populate('user', 'name email avatar')
      .populate('opportunity', 'title category organization location')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, applications, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
