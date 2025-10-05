import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { getFeaturedProperties, subscribeToFeaturedProperties } from './services/propertyService';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Load featured properties from Firebase
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const properties = await getFeaturedProperties();
        setFeaturedProperties(properties);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();

    // Set up real-time listener
    const unsubscribe = subscribeToFeaturedProperties((properties) => {
      setFeaturedProperties(properties);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {sidebarOpen && <Sidebar onClose={toggleSidebar} />}
      <div className="flex-1">
        <Header onToggleSidebar={toggleSidebar} />
      
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

      {/* Property Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#22204A] mb-2">Featured Properties</h2>
            <p className="text-lg text-[#666]">Trusted Real Estate Solutions</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow overflow-hidden animate-pulse">
                  <div className="w-full h-56 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <div key={property.id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={property.images && property.images.length > 0 ? property.images[0].url : 'https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
                    alt={property.title}
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#22204A] mb-2">{property.title}</h3>
                    <p className="text-[#666] mb-2">
                      {property.bedrooms} Bed • {property.bathrooms} Bath • {property.area} sqft
                    </p>
                    <p className="text-[#666] mb-2">{property.location?.city}, {property.location?.state}</p>
                    <p className="text-xl font-bold text-[#22204A]">₹{property.price?.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      property.status === 'ready-to-move' 
                        ? 'bg-green-100 text-green-800'
                        : property.status === 'ongoing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              // Fallback when no properties
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No featured properties available at the moment.</p>
                <p className="text-gray-400 text-sm mt-2">Check back later for new listings!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

export default App;
