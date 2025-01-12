import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleProfileClick = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${backendUrl}/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const username = response.data.username;
      navigate(`/${username}`);
    } catch (error) {
      console.error('There was an error fetching the user info!', error);
      navigate('/signin');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    navigate('/signin');
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex-shrink-0">
            <a 
              href="/" 
              className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
            >
              TechVedas
            </a>
          </div>

          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link 
              to="/" 
              className="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              to="/create" 
              className="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors duration-200"
            >
              Create
            </Link>
            <Link 
              to="/blogs" 
              className="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors duration-200"
            >
              Blogs
            </Link>
            
            {isAuthenticated ? (
              <>
                <button 
                  onClick={handleProfileClick}
                  className="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors duration-200"
                >
                  Profile
                </button>
                <button 
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-white/10 hover:bg-white/20 
                  transition-colors duration-200 ml-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/signin"
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-white text-purple-600 
                hover:bg-purple-50 transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;