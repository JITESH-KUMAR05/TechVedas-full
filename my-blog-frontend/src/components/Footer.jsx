import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 fixed bottom-0 w-full">
      <div className="container mx-auto px-6 py-2">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} TechVedas. All rights reserved.
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <a 
              href="/privacy" 
              className="text-gray-400 hover:text-gray-300 text-xs transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-gray-400 hover:text-gray-300 text-xs transition-colors duration-200"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;