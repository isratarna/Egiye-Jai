const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

// GET /api/opportunities - public list with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { organization: { $regex: search, $options: 'i' } }
    ];
    const total = await Opportunity.countDocuments(filter);
    const opportunities = await Opportunity.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, opportunities, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/opportunities/public-stats — no auth, used by homepage OpportunitiesSection
router.get('/public-stats', async (req, res) => {
  try {
    const [total, resolved, categories] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'completed' }),
      Opportunity.distinct('category', { isActive: true }),
    ]);
    res.json({ success: true, total, resolved, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/opportunities/:id
router.get('/:id', async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id).populate('createdBy', 'name');
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found' });
    res.json({ success: true, opportunity: opp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/opportunities - admin only
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body, createdBy: req.user._id };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'egiyejai/opportunities', `opp_${Date.now()}`);
      data.image = result.secure_url;
      data.imagePublicId = result.public_id;
    }
    if (data.requirements && typeof data.requirements === 'string') {
      data.requirements = data.requirements.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (data.benefits && typeof data.benefits === 'string') {
      data.benefits = data.benefits.split(',').map(s => s.trim()).filter(Boolean);
    }
    const opp = await Opportunity.create(data);
    res.status(201).json({ success: true, opportunity: opp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/opportunities/:id - admin only
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'egiyejai/opportunities', `opp_${req.params.id}`);
      data.image = result.secure_url;
      data.imagePublicId = result.public_id;
    }
    if (data.requirements && typeof data.requirements === 'string') {
      data.requirements = data.requirements.split(',').map(s => s.trim()).filter(Boolean);
    }
    const opp = await Opportunity.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, opportunity: opp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/opportunities/:id - admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Opportunity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Opportunity deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
