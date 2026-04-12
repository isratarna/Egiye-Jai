const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const { verifyToken } = require('../middleware/auth');

// Get all donations (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const donations = await Donation.find().populate('userId', 'name email');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user donations
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.params.userId });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create donation
router.post('/', verifyToken, async (req, res) => {
  const donation = new Donation({
    userId: req.user.id,
    amount: req.body.amount,
    donationType: req.body.donationType,
    donorName: req.body.donorName,
    donorEmail: req.body.donorEmail,
    message: req.body.message,
    isAnonymous: req.body.isAnonymous,
    purpose: req.body.purpose
  });

  try {
    const newDonation = await donation.save();
    res.status(201).json(newDonation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update donation status
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    
    if (req.body.paymentStatus) donation.paymentStatus = req.body.paymentStatus;
    if (req.body.transactionId) donation.transactionId = req.body.transactionId;
    if (req.body.receiptUrl) donation.receiptUrl = req.body.receiptUrl;
    
    donation.updatedAt = Date.now();
    const updated = await donation.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete donation
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Donation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
