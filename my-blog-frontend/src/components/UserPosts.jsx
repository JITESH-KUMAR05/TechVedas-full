import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserPosts.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backendUrl}/user/${username}/posts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('There was an error fetching the user posts!', error);
        setError('Failed to load posts');
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [username]);

  if (isLoading) {
    return (
      <div className="user-posts-container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-posts-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="user-posts-container">
      <div className="user-posts-content">
        <div className="user-posts-header">
          <h1 className="user-posts-title">{username}'s Posts</h1>
        </div>
        {posts.length === 0 ? (
          <div className="error">No posts found</div>
        ) : (
          <div className="user-posts-grid">
            {posts.map(post => (
              <div key={post._id} className="user-post-card">
                <h3 className="user-post-title">{post.title}</h3>
                <p className="user-post-content">{post.content}</p>
                <div className="user-post-meta">
                  <p className="user-post-date">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPosts;