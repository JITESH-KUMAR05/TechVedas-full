import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${backendUrl}/auth/signup`, { username, email, password });
      navigate('/signin');
    } catch (error) {
      console.error('There was an error signing up!', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <a href="/" className="signup-logo-container">
            <img src="icon.png" alt="logo" className="signup-logo-image" />
          </a>
          <h2 className="signup-slide-in-right">Create Account</h2>
          <p className="signup-slide-in-right signup-delay-1">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-input-group">
            <InputBox
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              name="username"
              placeholder="Username"
              label="Username"
            />
            <InputBox
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              name="email"
              placeholder="Email"
              label="Email"
            />
            <InputBox
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              name="password"
              placeholder="Password"
              label="Password"
            />
          </div>

          <div className="signup-terms-checkbox">
            <input
              type="checkbox"
              id="terms"
              required
              className="signup-custom-checkbox"
            />
            <label htmlFor="terms">
              I accept the <a href="#" className="signup-hover-link">Terms and Conditions</a>
            </label>
          </div>

          <button
            type="submit"
            className={`signup-submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <a href="/signin" className="signup-hover-link">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputBox = ({ type, placeholder, name, value, onChange, label }) => {
  return (
    <div className="signup-input-box">
      <label className="signup-input-label">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className="signup-input-field"
        required
      />
    </div>
  );
};

export default Signup;