# TechVedas Blog Website

## Project Structure

1. **Frontend**: React with Vite and Tailwind CSS
2. **Backend**: Express with Node.js and MongoDB
3. **AI Features**: Integrate Gemini API for AI functionalities

## Step 1: Setting Up the Frontend

### 1.1 Create React App with Vite

Open your terminal and run the following commands:

```bash
npm create vite@latest blog-frontend --template react
cd blog-frontend
npm install

1.2 Install Tailwind CSS
Follow these steps to install Tailwind CSS:

Install Tailwind CSS and its dependencies:
npm install -D tailwindcss postcss autoprefixer

Initialize Tailwind CSS:
npx tailwindcss init -p

Configure tailwind.config.js:
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

Add Tailwind to your CSS:

In src/index.css, add the following lines
@tailwind base;
@tailwind components;
@tailwind utilities;

1.3 Create Basic Components
Create basic components for your blog, such as Header, Footer, PostList, and Post.

mkdir src/components
touch src/components/Header.jsx src/components/Footer.jsx src/components/PostList.jsx src/components/Post.jsx

1.4 Set Up Routing
Install React Router for navigation:
npm install react-router-dom

Set up routing in src/App.jsx:

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PostList from './components/PostList';
import Post from './components/Post';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/post/:id" element={<Post />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

Step 2: Setting Up the Backend
2.1 Create Express Server
Create a new directory for your backend:
mkdir blog-backend
cd blog-backend
npm init -y


2.2 Install Dependencies
Install Express, Mongoose, and CORS:
npm install express mongoose cors dotenv

2.3 Create Basic Server
Create a file named index.js:

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define your routes here
app.use('/posts', require('./routes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

2.4 Create MongoDB Models
Create a models directory and define a Post model:

mkdir models
touch models/Post.js

In models/Post.js:
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Post', PostSchema);

2.5 Create Routes
Create a routes directory and define routes for your posts:
mkdir routes
touch routes/index.js

In routes/index.js:
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get all posts sorted by date
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get top posts sorted by likes
router.get('/top', async (req, res) => {
  try {
    const posts = await Post.find().sort({ likes: -1 }).limit(5);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like a post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

Step 3: Integrating Gemini for AI Features
3.1 Set Up Gemini API
You will need to sign up for Gemini and get your API key. Once you have it, you can create a service to interact with the Gemini API.

Create a new directory for services:

mkdir services
touch services/geminiService.js

In services/geminiService.js:

const axios = require('axios');

const GEMINI_API_URL = 'https://api.gemini.com/v1'; // Replace with actual Gemini API URL
const API_KEY = process.env.GEMINI_API_KEY;

const getAIResponse = async (prompt) => {
  try {
    const response = await axios.post(`${GEMINI_API_URL}/ai`, {
      prompt,
      apiKey: API_KEY,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching AI response:', error);
    throw error;
  }
};

module.exports = { getAIResponse };

