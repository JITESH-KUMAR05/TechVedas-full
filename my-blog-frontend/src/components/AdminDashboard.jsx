import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/users`);
      setUsers(response.data);
    };

    const fetchPosts = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts`);
      setPosts(response.data);
    };

    fetchUsers();
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}`);
    setPosts(posts.filter(post => post._id !== postId));
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.username} - {user.email}</li>
        ))}
      </ul>
      <h2>Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            {post.title} by {post.author.username}
            <button onClick={() => handleDeletePost(post._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;