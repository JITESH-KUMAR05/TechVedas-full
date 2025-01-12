const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      username: decoded.username
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('authorID', 'username').sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new post
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ 
        message: 'Title and content are required'
      });
    }

    const post = new Post({
      title,
      content,
      authorID: req.user.userId,
      author: req.user.username,
      likes: [] // Initialize empty likes array
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error('Post creation error:', err);
    res.status(400).json({ message: err.message });
  }
});


// Get top posts
router.get('/top', async (req, res) => {
  try {
    const topPosts = await Post.find().sort({ likes: -1 }).limit(10).populate('authorID', 'username');
    res.json(topPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like a post
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.userId)) {
      post.likes.push(req.user.userId);
      await post.save();
      res.json(post);
    } else {
      res.status(400).json({ message: 'User already liked this post' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unlike a post
router.post('/:id/unlike', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes = post.likes.filter(userId => userId.toString() !== req.user.userId);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;