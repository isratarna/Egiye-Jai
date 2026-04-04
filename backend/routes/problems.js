const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Problem = require('../models/Problem');

// Get problems
router.get('/', async (req, res) => {
  try {
    const { division } = req.query;
    let query = {};
    if (division) {
      query.location = division;
    }
    const problems = await Problem.find(query)
      .populate('reportedBy', 'name avatar')
      .populate('comments.user', 'name avatar')
      .populate('solutions.solvedBy', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, problems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Report a problem
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, location, images } = req.body;
    const problem = await Problem.create({
      title,
      description,
      location,
      images,
      reportedBy: req.user._id
    });
    res.status(201).json({ success: true, problem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Like / unlike a problem
router.post('/:id/like', protect, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    const index = problem.likes.indexOf(req.user._id);
    let message = '';
    if (index === -1) {
      problem.likes.push(req.user._id);
      message = 'Problem liked';
    } else {
      problem.likes.splice(index, 1);
      message = 'Problem unliked';
    }
    await problem.save();
    res.json({ success: true, message, likes: problem.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Comment on a problem
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    problem.comments.push({ user: req.user._id, text });
    await problem.save();
    
    // Repopulate user info for comment
    await problem.populate('comments.user', 'name avatar');
    res.json({ success: true, comments: problem.comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Submit a solution
router.post('/:id/solve', protect, async (req, res) => {
  try {
    const { proofImage, description } = req.body;
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    problem.solutions.push({
      solvedBy: req.user._id,
      proofImage,
      description
    });
    await problem.save();
    res.json({ success: true, message: 'Solution submitted for review' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
