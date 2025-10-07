import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Properties from './components/Properties';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Component to conditionally render Footer
  const ConditionalFooter = () => {
    const location = useLocation();
    // Hide footer on Properties page
    if (location.pathname === '/properties') {
      return null;
    }
    return <Footer />;
  };

  const HomePage = () => (
    <>
      {/* Hero Section with background image */}
      <section
        className="relative text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Home
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-[#e8eaf6]">
              Discover the perfect property with our trusted real estate solutions
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Enter location, property type, or price range"
                  className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22204A]"
                />
                <button className="bg-[#22204A] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#1a1a3a] transition duration-300 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
              
              {/* Property Type Buttons */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button className="bg-white/90 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-white transition duration-300 shadow-md">
                  Apartments
                </button>
                <button className="bg-white/90 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-white transition duration-300 shadow-md">
                  Villas
                </button>
                <button className="bg-white/90 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-white transition duration-300 shadow-md">
                  Plots
                </button>
                <button className="bg-white/90 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-white transition duration-300 shadow-md">
                  Ongoing
                </button>
                <button className="bg-white/90 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-white transition duration-300 shadow-md">
                  Pre Launch
                </button>
                <button className="bg-white/90 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-white transition duration-300 shadow-md">
                  Ready to Move
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <Router>
      <div className="min-h-screen bg-[#f8f9fa]">
        {sidebarOpen && <Sidebar onClose={toggleSidebar} />}
        <div className="flex-1">
          <Header onToggleSidebar={toggleSidebar} />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<Properties />} />
          </Routes>
        </div>
        
        {/* Conditional Footer - hidden on Properties page */}
        <ConditionalFooter />
      </div>
    </Router>
  );
}

export default App;
