import React from 'react';
import { useOutletContext } from 'react-router-dom';

/**
 * Homepage Component
 * Main page of the application
 */
function Homepage() {
  // Get openAuthModal function from outlet context
  const { openAuthModal } = useOutletContext();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Connect with the Right <span className="text-blue-600">Business Opportunities</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Buy, sell, or invest in businesses, franchises, startups, and digital assets across India. Find your perfect match today.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => openAuthModal('register')}
                >
                  Get Started
                </button>
                <button
                  className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Marketplace
                </button>
              </div>
            </div>
            <div className="hidden lg:block lg:w-1/2">
              {/* Placeholder for image */}
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Hero Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Find Your Perfect Business Match</h2>
            <p className="mt-4 text-xl text-gray-600">Search through thousands of listings across India</p>
          </div>
          
          {/* Placeholder for search component */}
          <div className="w-full p-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Search Component Placeholder</span>
          </div>
        </div>
      </section>

      {/* Marketplace Carousels Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
            <p className="mt-4 text-xl text-gray-600">Browse our top opportunities</p>
          </div>
          
          {/* Placeholder for carousels */}
          <div className="w-full p-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Carousels Placeholder</span>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose BusinessOptions</h2>
            <p className="mt-4 text-xl text-gray-600">We're more than just a marketplace</p>
          </div>
          
          {/* Placeholder for features */}
          <div className="w-full p-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Features Grid Placeholder</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">Your journey to business success in simple steps</p>
          </div>
          
          {/* Placeholder for steps */}
          <div className="w-full p-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Steps Placeholder</span>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
            <p className="mt-4 text-xl text-gray-600">Hear what our customers have to say</p>
          </div>
          
          {/* Placeholder for testimonials */}
          <div className="w-full p-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Testimonials Placeholder</span>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Our Impact in Numbers</h2>
            <p className="mt-4 text-xl opacity-80">Growing stronger with every connection</p>
          </div>
          
          {/* Placeholder for statistics */}
          <div className="w-full p-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-blue-100">Statistics Placeholder</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-xl p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of businesses and investors finding their perfect match on BusinessOptions
              </p>
              <button
                className="px-8 py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-lg"
                onClick={() => openAuthModal('register')}
              >
                Create Your Free Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;