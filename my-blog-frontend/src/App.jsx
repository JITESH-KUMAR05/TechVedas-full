import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import UserPosts from './components/UserPosts';
import AdminDashboard from './components/AdminDashboard';
import Blog from './components/Blog';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const isValid = decodedToken.exp * 1000 > Date.now();
        setIsAuthenticated(isValid);
        if (!isValid) {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="loading-screen">
      <div className="loading-spinner"></div>
    </div>;
  }

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        </header>

        <main className="app-main">
          <div className="content-wrapper">
            <Routes>
              <Route 
                path="/" 
                element={
                  <div className="page-transition">
                    {isAuthenticated ? <PostList /> : <Navigate to="/signin" />}
                  </div>
                } 
              />
              <Route 
                path="/create" 
                element={
                  <div className="page-transition">
                    {isAuthenticated ? <CreatePost /> : <Navigate to="/signin" />}
                  </div>
                } 
              />
              <Route 
                path="/signin" 
                element={
                  <div className="page-transition">
                    {isAuthenticated ? <Navigate to="/" /> : 
                      <Signin setIsAuthenticated={setIsAuthenticated} />}
                  </div>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <div className="page-transition">
                    {isAuthenticated ? <Navigate to="/" /> : <Signup />}
                  </div>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <div className="page-transition">
                    {isAuthenticated ? <UserPosts /> : <Navigate to="/signin" />}
                  </div>
                } 
              />
              <Route 
                path="/blogs" 
                element={
                  <div className="page-transition">
                    <Blog />
                  </div>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <div className="page-transition">
                    {isAuthenticated ? <AdminDashboard /> : <Navigate to="/signin" />}
                  </div>
                } 
              />
              <Route 
                path="/:username" 
                element={
                  <div className="page-transition">
                    {isAuthenticated ? <UserPosts /> : <Navigate to="/signin" />}
                  </div>
                } 
              />
            </Routes>
          </div>
        </main>

        <footer className="app-footer">
          <Footer />
        </footer>

        <div className="chatbot-container">
          <Chatbot />
        </div>
      </div>
    </Router>
  );
};

export default App;