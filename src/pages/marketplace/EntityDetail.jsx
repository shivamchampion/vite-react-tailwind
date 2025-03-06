import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, Map, Phone, Mail, Calendar, Building, TrendingUp, AlertCircle } from 'lucide-react';
import { APP_ROUTES } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

/**
 * EntityDetailPage Component
 * Displays detailed information about a specific entity
 */
function EntityDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Placeholder entity data
  const entity = {
    id: id,
    type: 'business',
    title: 'Sample Business Name',
    description: 'This is a placeholder description for a business that would be listed on the platform. The actual content would be loaded from the database.',
    price: '75,00,000',
    location: 'Mumbai, Maharashtra',
    category: 'Food & Beverage',
    establishedYear: '2015',
    revenue: '1.2 Cr',
    employees: '15-20',
    images: [1, 2, 3, 4],
    features: [
      'Prime location with high foot traffic',
      'Fully equipped and operational',
      'Loyal customer base',
      'Trained staff willing to continue'
    ]
  };
  
  // Tab content
  const tabContent = {
    overview: (
      <div>
        <h3 className="text-xl font-bold mb-4">Business Overview</h3>
        <p className="text-gray-700 mb-6">
          {entity.description}
        </p>
        
        <h3 className="text-xl font-bold mb-4">Key Features</h3>
        <ul className="list-disc pl-5 mb-6 space-y-1">
          {entity.features.map((feature, index) => (
            <li key={index} className="text-gray-700">{feature}</li>
          ))}
        </ul>
        
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex items-start">
            <AlertCircle size={20} className="text-blue-600 mr-3 mt-0.5" />
            <p className="text-sm text-blue-600">
              This is a placeholder entity detail page. In a real implementation, this would display 
              detailed information about the entity loaded from the database.
            </p>
          </div>
        </div>
      </div>
    ),
    financials: (
      <div>
        <h3 className="text-xl font-bold mb-4">Financial Details</h3>
        <p className="text-gray-700 mb-6">
          Financial information would be displayed here. This is a placeholder section.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-md p-4">
            <h4 className="text-lg font-semibold mb-2">Revenue</h4>
            <p className="text-3xl font-bold text-blue-600">₹ {entity.revenue}</p>
            <p className="text-sm text-gray-500">Annual revenue</p>
          </div>
          <div className="border rounded-md p-4">
            <h4 className="text-lg font-semibold mb-2">Profit</h4>
            <p className="text-3xl font-bold text-green-600">₹ 28 L</p>
            <p className="text-sm text-gray-500">Annual profit</p>
          </div>
        </div>
      </div>
    ),
    documents: (
      <div>
        <h3 className="text-xl font-bold mb-4">Business Documents</h3>
        <p className="text-gray-700 mb-6">
          {isAuthenticated 
            ? 'Documents would be available to view here after connecting with the seller.'
            : 'Please login and connect with the seller to view business documents.'}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isAuthenticated ? (
            Array(4).fill().map((_, index) => (
              <div key={index} className="border rounded-md p-4 flex items-center">
                <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center mr-4">
                  <span className="text-gray-400">Doc</span>
                </div>
                <div>
                  <p className="font-medium">Document {index + 1}</p>
                  <p className="text-sm text-gray-500">PDF, 2.3 MB</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 border border-yellow-200 bg-yellow-50 p-4 rounded-md">
              <div className="flex">
                <AlertCircle size={20} className="text-yellow-600 mr-3" />
                <p className="text-yellow-700">
                  Please <Link to={APP_ROUTES.HOME} className="underline font-medium">login</Link> to view documents.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    contact: (
      <div>
        <h3 className="text-xl font-bold mb-4">Contact Business Owner</h3>
        
        {isAuthenticated ? (
          <div>
            <p className="text-gray-700 mb-6">
              Fill out the form below to connect with the business owner.
            </p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="4"
                  placeholder="I'm interested in your business and would like to know more about..."
                ></textarea>
              </div>
              
              <button 
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send Message (Uses 1 Connect)
              </button>
            </form>
          </div>
        ) : (
          <div className="border border-yellow-200 bg-yellow-50 p-4 rounded-md">
            <div className="flex">
              <AlertCircle size={20} className="text-yellow-600 mr-3" />
              <p className="text-yellow-700">
                Please <Link to={APP_ROUTES.HOME} className="underline font-medium">login</Link> to contact the business owner.
              </p>
            </div>
          </div>
        )}
      </div>
    )
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button and actions */}
        <div className="flex justify-between items-center mb-6">
          <Link to={APP_ROUTES.MARKETPLACE.BUSINESS} className="flex items-center text-blue-600">
            <ArrowLeft size={18} className="mr-1" />
            Back to Listings
          </Link>
          
          <div className="flex space-x-2">
            <button className="p-2 rounded-full border hover:bg-gray-50">
              <Share2 size={18} />
            </button>
            <button className="p-2 rounded-full border hover:bg-gray-50">
              <Heart size={18} />
            </button>
          </div>
        </div>
        
        {/* Entity Title and Price */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{entity.title}</h1>
          <div className="flex flex-wrap items-center mt-2">
            <div className="flex items-center text-gray-500 mr-4">
              <Map size={16} className="mr-1" />
              <span>{entity.location}</span>
            </div>
            <div className="flex items-center text-gray-500 mr-4">
              <Building size={16} className="mr-1" />
              <span>{entity.category}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar size={16} className="mr-1" />
              <span>Est. {entity.establishedYear}</span>
            </div>
          </div>
        </div>
        
        {/* Image Gallery Placeholder */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4 md:col-span-2 h-80 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Main Image Placeholder</span>
            </div>
            {entity.images.slice(1).map((_, index) => (
              <div key={index} className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Image {index + 2}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="border-b mb-6">
              <nav className="flex space-x-8">
                {['overview', 'financials', 'documents', 'contact'].map((tab) => (
                  <button
                    key={tab}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Content */}
            {tabContent[activeTab]}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-8">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-5 border-b">
                  <div className="text-3xl font-bold text-gray-900">₹ {entity.price}</div>
                  <p className="text-gray-500">Asking Price</p>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Business Stats */}
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Monthly Revenue</span>
                    <span className="font-semibold">₹ 10 L</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Employees</span>
                    <span className="font-semibold">{entity.employees}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Growth Rate</span>
                    <span className="font-semibold text-green-600 flex items-center">
                      <TrendingUp size={16} className="mr-1" />
                      12%
                    </span>
                  </div>
                  
                  {/* Owner Contact */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold mb-3">Business Owner</h3>
                    
                    {isAuthenticated ? (
                      <div>
                        <div className="flex items-center mb-3">
                          <div className="h-12 w-12 rounded-full bg-gray-200 mr-3"></div>
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-sm text-gray-500">Owner since 2015</p>
                          </div>
                        </div>
                        
                        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-2">
                          Contact Owner
                        </button>
                        
                        <div className="flex justify-between">
                          <button className="flex items-center text-blue-600 text-sm">
                            <Phone size={16} className="mr-1" />
                            Call
                          </button>
                          <button className="flex items-center text-blue-600 text-sm">
                            <Mail size={16} className="mr-1" />
                            Email
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500 mb-3">
                          Login to view contact information and connect with the owner.
                        </p>
                        <button 
                          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          onClick={() => {
                            // Handle login redirect
                          }}
                        >
                          Login to Connect
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntityDetailPage;