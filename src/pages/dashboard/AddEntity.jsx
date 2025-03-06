import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Monitor, 
  Check, 
  ArrowRight, 
  Image as ImageIcon 
} from 'lucide-react';
import { useEntity } from '../../contexts/EntityContext';
import { APP_ROUTES, ENTITY_TYPES, PLAN_TYPES, PLAN_FEATURES, INDIAN_CITIES } from '../../utils/constants';

/**
 * AddEntityPage Component
 * Form for creating a new entity
 */
function AddEntityPage() {
  const navigate = useNavigate();
  const { createEntity, loading, error } = useEntity();
  
  // Multi-step form state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    price: '',
    location: '',
    category: '',
    plan: PLAN_TYPES.BASIC,
    images: []
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle entity type selection
  const handleTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, type }));
    setStep(2);
  };
  
  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setFormData(prev => ({ ...prev, plan }));
    setStep(4);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createEntity({
        ...formData,
        status: 'active',
        createdAt: new Date(),
        views: 0
      });
      
      navigate(APP_ROUTES.DASHBOARD.ENTITIES);
    } catch (err) {
      console.error('Error creating entity:', err);
    }
  };
  
  // Proceed to next step
  const nextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };
  
  // Go back to previous step
  const prevStep = () => {
    setStep(step - 1);
  };
  
  // Entity type options
  const entityTypes = [
    {
      type: ENTITY_TYPES.BUSINESS,
      title: 'Business',
      description: 'Established businesses with proven revenue and operations',
      icon: <Building size={24} />
    },
    {
      type: ENTITY_TYPES.FRANCHISE,
      title: 'Franchise',
      description: 'Franchise opportunities for established brands',
      icon: <Briefcase size={24} />
    },
    {
      type: ENTITY_TYPES.STARTUP,
      title: 'Startup',
      description: 'Early-stage companies seeking investment or buyers',
      icon: <TrendingUp size={24} />
    },
    {
      type: ENTITY_TYPES.INVESTOR,
      title: 'Investor',
      description: 'Individuals or firms looking to invest in businesses',
      icon: <Users size={24} />
    },
    {
      type: ENTITY_TYPES.DIGITAL_ASSET,
      title: 'Digital Asset',
      description: 'Websites, apps, or online businesses for sale',
      icon: <Monitor size={24} />
    }
  ];
  
  // Form content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-bold mb-6">Select Entity Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entityTypes.map((entity) => (
                <button
                  key={entity.type}
                  className={`p-6 border rounded-lg text-left hover:border-blue-500 hover:shadow-md transition-all ${
                    formData.type === entity.type ? 'border-blue-500 bg-blue-50 shadow-md' : ''
                  }`}
                  onClick={() => handleTypeSelect(entity.type)}
                >
                  <div className="flex items-center mb-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {entity.icon}
                    </div>
                    <h3 className="ml-3 text-lg font-medium">{entity.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm">{entity.description}</p>
                </button>
              ))}
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h2 className="text-xl font-bold mb-6">Enter Basic Information</h2>
            <form onSubmit={nextStep}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${formData.type === ENTITY_TYPES.BUSINESS ? 'business' : formData.type === ENTITY_TYPES.FRANCHISE ? 'franchise' : formData.type === ENTITY_TYPES.STARTUP ? 'startup' : formData.type === ENTITY_TYPES.INVESTOR ? 'investor' : 'digital asset'} name`}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Provide a detailed description"
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.type === ENTITY_TYPES.INVESTOR ? 'Investment Amount' : 'Asking Price'} (₹)
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="text"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 50,00,000"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select location</option>
                      {INDIAN_CITIES.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Food & Beverage, Technology, Real Estate"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </form>
          </>
        );
        
      case 3:
        return (
          <>
            <h2 className="text-xl font-bold mb-6">Select a Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(PLAN_TYPES).map((plan) => {
                const features = PLAN_FEATURES[plan];
                return (
                  <div 
                    key={plan}
                    className={`border rounded-lg overflow-hidden transition-all ${
                      formData.plan === plan ? 'border-blue-500 shadow-md' : 'hover:shadow-md hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-4 text-center ${plan === PLAN_TYPES.BASIC ? 'bg-gray-50' : plan === PLAN_TYPES.ADVANCED ? 'bg-blue-50' : plan === PLAN_TYPES.PREMIUM ? 'bg-purple-50' : 'bg-yellow-50'}`}>
                      <h3 className="text-lg font-bold">{features.name}</h3>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">₹{features.price}</span>
                        <span className="text-gray-500">/month</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Check size={16} className="text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm">{features.connectsIncluded} connects included</span>
                        </li>
                        <li className="flex items-start">
                          <Check size={16} className="text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm">{features.featuredListing ? 'Featured listing' : 'Standard listing'}</span>
                        </li>
                        <li className="flex items-start">
                          <Check size={16} className="text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm">{features.analytics ? 'Advanced analytics' : 'Basic analytics'}</span>
                        </li>
                        <li className="flex items-start">
                          <Check size={16} className="text-green-500 mt-0.5 mr-2" />
                          <span className="text-sm">{features.supportLevel} support</span>
                        </li>
                      </ul>
                      
                      <button
                        type="button"
                        onClick={() => handlePlanSelect(plan)}
                        className={`w-full mt-4 py-2 rounded-md ${
                          formData.plan === plan
                            ? 'bg-blue-600 text-white'
                            : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {formData.plan === plan ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </>
        );
        
      case 4:
        return (
          <>
            <h2 className="text-xl font-bold mb-6">Upload Images</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="max-w-lg mx-auto">
                <ImageIcon size={48} className="mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Upload Images</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop image files, or click to select files
                </p>
                <div className="mt-4">
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    Select Files
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              
              {/* Image preview would go here */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Placeholder for uploaded images */}
                <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image 1</span>
                </div>
                <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image 2</span>
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-gray-500 text-sm">
              * Image upload is optional. You can add images later.
            </p>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </>
        );
        
      case 5:
        return (
          <>
            <h2 className="text-xl font-bold mb-6">Review and Submit</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-4">Entity Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Entity Type</p>
                  <p className="font-medium">
                    {formData.type === ENTITY_TYPES.BUSINESS ? 'Business' : 
                     formData.type === ENTITY_TYPES.FRANCHISE ? 'Franchise' : 
                     formData.type === ENTITY_TYPES.STARTUP ? 'Startup' : 
                     formData.type === ENTITY_TYPES.INVESTOR ? 'Investor' : 
                     'Digital Asset'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="font-medium">{formData.title}</p>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium">{formData.description}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">
                    {formData.type === ENTITY_TYPES.INVESTOR ? 'Investment Amount' : 'Asking Price'}
                  </p>
                  <p className="font-medium">₹ {formData.price}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{formData.location}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{formData.category}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Selected Plan</p>
                  <p className="font-medium">
                    {PLAN_FEATURES[formData.plan].name} - ₹{PLAN_FEATURES[formData.plan].price}/month
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <button
                type="button"
                onClick={handleSubmit}
                className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 font-medium ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Entity'}
                <ArrowRight size={16} className="ml-2" />
              </button>
              
              <button
                type="button"
                onClick={prevStep}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Entity</h1>
        <p className="text-gray-600 mt-1">
          Create a new listing for your business, franchise, startup, or investment opportunity
        </p>
      </header>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Progress Steps */}
        <div className="border-b">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex">
              {['Entity Type', 'Basic Info', 'Select Plan', 'Images', 'Review'].map((label, index) => {
                const stepNum = index + 1;
                return (
                  <div key={label} className={`flex-1 ${stepNum < 5 ? 'border-r' : ''}`}>
                    <button
                      className={`w-full py-4 text-center text-sm focus:outline-none ${
                        step === stepNum
                          ? 'font-medium text-blue-600'
                          : step > stepNum
                          ? 'font-medium text-gray-500'
                          : 'text-gray-400'
                      }`}
                      onClick={() => stepNum < step && setStep(stepNum)}
                      disabled={stepNum > step}
                    >
                      <span className={`mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full ${
                        step === stepNum
                          ? 'bg-blue-100 text-blue-600'
                          : step > stepNum
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step > stepNum ? <Check size={12} /> : stepNum}
                      </span>
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}

export default AddEntityPage;