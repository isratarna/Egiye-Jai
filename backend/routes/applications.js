const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const BADGES = [
  { threshold: 1, name: 'First Step', icon: '🌱' },
  { threshold: 3, name: 'Rising Star', icon: '⭐' },
  { threshold: 5, name: 'Dedicated Volunteer', icon: '🏅' },
  { threshold: 10, name: 'Community Champion', icon: '🏆' },
  { threshold: 20, name: 'Legend', icon: '🌟' },
];

async function checkAndAwardBadges(userId) {
  const completed = await Application.countDocuments({ user: userId, status: 'completed' });
  const user = await User.findById(userId);
  const existingNames = user.badges.map(b => b.name);
  const newBadges = BADGES.filter(b => completed >= b.threshold && !existingNames.includes(b.name));
  if (newBadges.length) {
    user.badges.push(...newBadges);
    await user.save();
  }
}

// POST /api/applications - apply for opportunity
router.post('/', protect, async (req, res) => {
  try {
    const { opportunityId, motivation, experience, availability } = req.body;
    const opp = await Opportunity.findById(opportunityId);
    if (!opp || !opp.isActive) return res.status(404).json({ success: false, message: 'Opportunity not found' });
    if (opp.spotsRemaining <= 0) return res.status(400).json({ success: false, message: 'No spots remaining' });

    const exists = await Application.findOne({ user: req.user._id, opportunity: opportunityId });
    if (exists) return res.status(400).json({ success: false, message: 'Already applied to this opportunity' });

    const app = await Application.create({
      user: req.user._id,
      opportunity: opportunityId,
      motivation,
      experience,
      availability,
    });

    await Opportunity.findByIdAndUpdate(opportunityId, { $inc: { applicationsCount: 1 } });
    const populated = await app.populate('opportunity', 'title category location organization');
    res.status(201).json({ success: true, application: populated });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Already applied' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/applications/my - user's applications
router.get('/my', protect, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user._id })
      .populate('opportunity', 'title category location duration image organization color')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/applications - admin: all applications
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const total = await Application.countDocuments(filter);
    const apps = await Application.find(filter)
      .populate('user', 'name email avatar')
      .populate('opportunity', 'title category organization')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, applications: apps, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/applications/:id/status - admin approve/reject
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNote, hoursLogged } = req.body;
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

    const prev = app.status;
    app.status = status;
    app.adminNote = adminNote || app.adminNote;
    app.reviewedAt = new Date();

    if (status === 'completed') {
      app.completedAt = new Date();
      app.hoursLogged = hoursLogged || 0;
      await User.findByIdAndUpdate(app.user, { $inc: { totalHours: hoursLogged || 0 } });
      await checkAndAwardBadges(app.user);
    }

    if (status === 'approved' && prev !== 'approved') {
      await Opportunity.findByIdAndUpdate(app.opportunity, { $inc: { spotsRemaining: -1 } });
    }
    if (prev === 'approved' && status !== 'approved') {
      await Opportunity.findByIdAndUpdate(app.opportunity, { $inc: { spotsRemaining: 1 } });
    }

    await app.save();
    const populated = await app.populate([
      { path: 'user', select: 'name email avatar' },
      { path: 'opportunity', select: 'title category organization' }
    ]);
    res.json({ success: true, application: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
