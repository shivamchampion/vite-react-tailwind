import React from 'react';
import { useOutletContext } from 'react-router-dom';

// Example homepage component that safely uses openAuthModal from context
const Homepage = () => {
  // Safely destructure to handle when context is undefined
  const context = useOutletContext();
  const openAuthModal = context?.openAuthModal;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Business Options</h1>
      
      {/* Your homepage content here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Find Your Next Business Opportunity</h2>
          <p className="text-gray-700 mb-4">
            Browse through thousands of verified business listings and find the perfect opportunity.
          </p>
          {/* Safely use openAuthModal only if it exists */}
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            onClick={() => openAuthModal && openAuthModal('register')}
          >
            Get Started
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">List Your Business</h2>
          <p className="text-gray-700 mb-4">
            Reach thousands of potential buyers by listing your business on our platform.
          </p>
          {/* Safely use openAuthModal only if it exists */}
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            onClick={() => openAuthModal && openAuthModal('login')}
          >
            List Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;