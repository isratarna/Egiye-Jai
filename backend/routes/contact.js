const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    await Contact.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully! We will get back to you soon.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/contact - admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    const filter = unread === 'true' ? { isRead: false } : {};
    const total = await Contact.countDocuments(filter);
    const messages = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, messages, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/contact/:id/read
router.patch('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/contact/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
