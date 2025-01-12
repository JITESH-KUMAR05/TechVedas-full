import React from 'react';
import './Blog.css';

const Blog = ({ title, content, date, likes, onLike }) => {
  return (
    <div className="blog-detail-container">
      <div className="blog-detail-content">
        <div className="blog-detail-header">
          <h1 className="blog-detail-title">{title}</h1>
          <div className="blog-detail-meta">
            <span className="blog-detail-date">
              {new Date(date).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="blog-detail-body">
          {content}
        </div>
        
        <div className="blog-detail-actions">
          <button
            onClick={onLike}
            className="action-button like-button"
          >
            Like <span className="like-count">({likes?.length || 0})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;