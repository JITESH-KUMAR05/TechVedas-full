import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BlogList.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://techvedas-backend.onrender.com/posts"
        );
        setBlogs(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("There was an error fetching the blogs!", error);
        setError("Failed to load blogs");
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleLike = async (id) => {
    try {
      await axios.post(
        `https://techvedas-backend.onrender.com/posts/${id}/like`
      );
      setBlogs(
        blogs.map((blog) =>
          blog._id === id 
            ? { ...blog, likes: [...(blog.likes || []), 'newLike'] } 
            : blog
        )
      );
    } catch (error) {
      console.error("There was an error liking the blog!", error);
    }
  };

  if (isLoading) {
    return (
      <div className="blog-container">
        <div className="loading">Loading blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div className="blog-content">
        <div className="blog-header">
          <h2 className="blog-title">All Blogs</h2>
        </div>
        {blogs.length === 0 ? (
          <div className="empty-state">No blogs found</div>
        ) : (
          <div className="blog-grid">
            {blogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-content">{blog.content}</p>
                <div className="blog-meta">
                  <p className="blog-date">
                    {new Date(blog.date).toLocaleDateString()}
                  </p>
                  <p className="blog-author">
                    By {blog.author?.username || 'Anonymous'}
                  </p>
                </div>
                <button
                  onClick={() => handleLike(blog._id)}
                  className="like-button"
                >
                  Like <span className="like-count">({blog.likes?.length || 0})</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
