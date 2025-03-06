import React from 'react';
import { useAuthModal } from '../../layouts/MainLayout';
import { Building, Briefcase, Users, Search, TrendingUp, Globe } from 'lucide-react';

/**
 * Homepage Component
 * Main landing page for the Business Options website
 */
const Homepage = () => {
  // Get the openAuthModal function from context
  const { openAuthModal } = useAuthModal();
  
  // Feature cards for the homepage
  const featureCards = [
    {
      title: 'Find Your Next Business',
      description: 'Browse through thousands of verified businesses for sale across India.',
      icon: <Building className="w-6 h-6 text-indigo-600" />,
      buttonText: 'Explore Businesses',
      buttonAction: () => window.location.href = '/businesses',
      color: 'bg-indigo-50'
    },
    {
      title: 'Sell Your Business',
      description: 'List your business and connect with serious buyers and investors.',
      icon: <Briefcase className="w-6 h-6 text-green-600" />,
      buttonText: 'List Your Business',
      buttonAction: () => openAuthModal('register'),
      color: 'bg-green-50'
    },
    {
      title: 'Find Investors',
      description: 'Connect with active investors looking for promising opportunities.',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      buttonText: 'Meet Investors',
      buttonAction: () => window.location.href = '/investors',
      color: 'bg-blue-50'
    },
    {
      title: 'Digital Assets',
      description: 'Explore websites, apps, and online businesses for sale.',
      icon: <Globe className="w-6 h-6 text-purple-600" />,
      buttonText: 'View Digital Assets',
      buttonAction: () => window.location.href = '/digital-assets',
      color: 'bg-purple-50'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Find the Perfect Business Opportunity
            </h1>
            <p className="text-xl text-indigo-100 mb-10">
              Connect with businesses, franchises, startups, and investors across India
            </p>
            
            {/* Search Box */}
            <div className="bg-white rounded-lg shadow-lg p-2 flex">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 border-0 focus:ring-0 focus:outline-none rounded-l-lg"
                  placeholder="Search by business type, location, or keywords..." 
                />
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Search
              </button>
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['All', 'Retail', 'Food & Beverage', 'Technology', 'Services', 'Manufacturing'].map((category) => (
                <span 
                  key={category} 
                  className="px-4 py-1.5 bg-indigo-700/30 rounded-full text-sm font-medium hover:bg-indigo-700/50 cursor-pointer"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Feature Cards Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Opportunities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureCards.map((card, index) => (
              <div key={index} className={`${card.color} rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow`}>
                <div className="p-6">
                  <div className="rounded-full w-12 h-12 flex items-center justify-center bg-white mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-600 mb-6">{card.description}</p>
                  <button 
                    className="w-full py-2 bg-white border border-gray-300 rounded-md text-gray-800 hover:bg-gray-50 transition-colors font-medium"
                    onClick={card.buttonAction}
                  >
                    {card.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">India's Leading Business Marketplace</h2>
            <p className="text-gray-600">Connecting buyers, sellers, and investors across the country</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '5,000+', label: 'Businesses Listed' },
              { number: '₹500Cr+', label: 'Transaction Value' },
              { number: '15,000+', label: 'Active Investors' },
              { number: '90%', label: 'Success Rate' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-indigo-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-indigo-100 mb-8">
              Join thousands of entrepreneurs and investors on Business Options
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                className="px-8 py-3 bg-white text-indigo-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                onClick={() => openAuthModal('register')}
              >
                Create Account
              </button>
              <button 
                className="px-8 py-3 bg-indigo-600 text-white border border-white rounded-lg font-medium hover:bg-indigo-800 transition-colors"
                onClick={() => openAuthModal('login')}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;