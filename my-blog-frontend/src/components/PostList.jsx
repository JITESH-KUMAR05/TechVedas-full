import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PostList.css"; // Make sure this import is correct

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const PostList = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backendUrl}/posts`);
        setLatestPosts(response.data);
      } catch (error) {
        console.error("There was an error fetching the latest posts!", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTopPosts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/posts/top`);
        setTopPosts(response.data);
      } catch (error) {
        console.error("There was an error fetching the top posts!", error);
      }
    };

    fetchPosts();
    fetchTopPosts();
  }, []);

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      await axios.post(
        `${backendUrl}/posts/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update posts after successful like
      const response = await axios.get(`${backendUrl}/posts`);
      setLatestPosts(response.data);
      
      const topResponse = await axios.get(`${backendUrl}/posts/top`);
      setTopPosts(topResponse.data);
    } catch (error) {
      console.error("There was an error liking the post!", error);
    }
  };

  if (isLoading) {
    return (
      <div className="post-container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="post-container">
      <div className="post-content">
        <h2 className="section-title">Latest Posts</h2>
        <div className="post-grid">
          {latestPosts.map((post) => (
            <div key={post._id} className="post-card">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-text">{post.content}</p>
              <div className="post-meta">
                <p className="post-date">
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <p className="post-author">By {post.author}</p>
              </div>
              <button
                onClick={() => handleLike(post._id)}
                className="like-button"
              >
                Like ({post.likes?.length || 0})
              </button>
            </div>
          ))}
        </div>

        <h2 className="section-title">Top Posts</h2>
        <div className="post-grid">
          {topPosts.map((post) => (
            <div key={post._id} className="post-card">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-text">{post.content}</p>
              <div className="post-meta">
                <p className="post-date">
                  {new Date(post.date).toLocaleDateString()}
                </p>
                <p className="post-author">By {post.author}</p>
              </div>
              <button
                onClick={() => handleLike(post._id)}
                className="like-button"
              >
                Like ({post.likes?.length || 0})
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostList;