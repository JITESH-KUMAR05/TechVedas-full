const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const router = express.Router();

// Middleware to authenticate admin
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || !decoded.isAdmin) return res.status(401).json({ message: 'Unauthorized' });
    req.user = decoded;
    next();
  });
};

// Get all users
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a post
router.delete('/posts/:id', authenticateAdmin, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;