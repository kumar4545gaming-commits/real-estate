import React from 'react';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="bg-[#efe5d1]/90 backdrop-blur border-b border-[#e2d6bd]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Hamburger + Logo/Name */}
          <div className="flex items-center">
            {/* Hamburger Menu */}
            <button 
              onClick={onToggleSidebar}
              className="hamburger-btn mr-3"
              aria-label="Toggle sidebar"
            >
              <span style={{fontSize: 22, lineHeight: 1}}>☰</span>
            </button>
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">DreamHome</h1>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#home"
                className="text-blue-700 border-b-2 border-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-gray-800 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                About
              </a>
              <a
                href="#properties"
                className="text-gray-800 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Properties
              </a>
              <a
                href="#agents"
                className="text-gray-800 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Agents
              </a>
              <a
                href="#contact"
                className="text-gray-800 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Contact
              </a>
            </div>
          </nav>

          {/* spacer on right for layout consistency */}
          <div className="md:hidden" />
        </div>
      </div>
    </header>
  );
};

export default Header;
