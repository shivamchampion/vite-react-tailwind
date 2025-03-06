import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * BusinessListingsPage Component
 * Displays listings for a specific entity type (business, franchise, etc.)
 */
function BusinessListingsPage({ type }) {
  // Get type from component props or URL params
  const params = useParams();
  const entityType = type || params.type || 'business';
  
  // Placeholder state
  const [loading, setLoading] = useState(false);
  
  // Title mapping based on entity type
  const typeTitles = {
    business: 'Businesses',
    franchise: 'Franchises',
    startup: 'Startups',
    investor: 'Investors',
    digital_asset: 'Digital Assets'
  };
  
  const title = typeTitles[entityType] || 'Businesses';

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{title} for Sale</h1>
        
        {/* Placeholder for filters */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-500 text-center">Filter Controls Placeholder</p>
        </div>
        
        {/* Placeholder for listings */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill().map((_, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                <span className="text-gray-400">Image Placeholder</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{title.slice(0, -1)} Listing #{index + 1}</h3>
              <p className="text-gray-500 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-600">₹ XX,XX,XXX</span>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination placeholder */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            <button className="px-3 py-1 border rounded-l-md">Previous</button>
            <button className="px-3 py-1 border-t border-b bg-blue-50">1</button>
            <button className="px-3 py-1 border">2</button>
            <button className="px-3 py-1 border">3</button>
            <button className="px-3 py-1 border rounded-r-md">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessListingsPage;