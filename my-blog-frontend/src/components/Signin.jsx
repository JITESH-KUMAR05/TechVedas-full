import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Signin.css'; // We'll create this file next

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Signin = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/auth/signin`, {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('userId', response.data.userId);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      console.error('Signin error:', error.response?.data || error.message);
      alert('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header fade-in">
          <a href="/" className="logo-container">
            <img
              src="icon.png"
              alt="logo"
              className="logo-image rotate-in"
            />
          </a>
          <h2 className="slide-in-right">Welcome back</h2>
          <p className="slide-in-right delay-1">Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form slide-up">
          <div className="input-group">
            <InputBox
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              name="email"
              placeholder="Email"
            />
            <InputBox
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              name="password"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className={`signin-submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="signin-footer slide-up delay-2">
          <div className="forgot-password">
            <a href="/#" className="hover-link">
              Forgot your password?
            </a>
          </div>
          <div className="signup-prompt">
            <p>
              Not a member yet?{' '}
              <a href="/signup" className="hover-link text-blue-600">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputBox = ({ type, placeholder, name, value, onChange }) => {
  return (
    <div className="input-box">
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="input-field"
      />
    </div>
  );
};

export default Signin;