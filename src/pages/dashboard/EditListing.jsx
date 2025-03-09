import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Monitor, 
  Check, 
  ArrowRight, 
  Image as ImageIcon,
  Info,
  AlertTriangle,
  Trash2,
  Save
} from 'lucide-react';
import { useListing } from '../../contexts/ListingContext';
import { APP_ROUTES, LISTING_TYPES, PLAN_TYPES, PLAN_FEATURES, INDIAN_CITIES } from '../../utils/constants';

/**
 * EditListingPage Component
 * Form for editing an existing listing
 */
function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListingById, updateListing, deleteListing, loading, error, clearError } = useListing();
  
  // Form state
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    price: '',
    location: '',
    category: '',
    plan: '',
    status: 'active',
    images: []
  });

  // UI state
  const [loadingListing, setLoadingListing] = useState(true);
  const [formError, setFormError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch listing data on component mount
  useEffect(() => {
    const fetchListingData = async () => {
      setLoadingListing(true);
      try {
        const listingData = await getListingById(id);
        
        if (!listingData) {
          setFormError('Listing not found');
          setLoadingListing(false);
          return;
        }
        
        setListing(listingData);
        setFormData({
          type: listingData.type || '',
          title: listingData.title || '',
          description: listingData.description || '',
          price: listingData.price || '',
          location: listingData.location || '',
          category: listingData.category || '',
          plan: listingData.plan || PLAN_TYPES.BASIC,
          status: listingData.status || 'active',
          images: listingData.images || []
        });
        setLoadingListing(false);
      } catch (err) {
        console.error('Error fetching listing:', err);
        setFormError('Failed to load listing details. Please try again.');
        setLoadingListing(false);
      }
    };

    if (id) {
      fetchListingData();
    }
  }, [id, getListingById]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle listing type selection
  const handleTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, type }));
    setActiveStep(2);
  };
  
  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setFormData(prev => ({ ...prev, plan }));
    setActiveStep(4);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      clearError();
      setFormError(null);
      
      await updateListing(id, {
        ...formData,
        updatedAt: new Date()
      });
      
      setSuccessMessage('Listing updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating listing:', err);
      setFormError('Failed to update listing. Please try again.');
    }
  };

  // Handle listing deletion
  const handleDelete = async () => {
    try {
      await deleteListing(id);
      navigate(APP_ROUTES.DASHBOARD.LISTINGS);
    } catch (err) {
      console.error('Error deleting listing:', err);
      setFormError('Failed to delete listing. Please try again.');
      setDeleteConfirm(false);
    }
  };
  
  // Navigate to next step
  const nextStep = (e) => {
    e.preventDefault();
    setActiveStep(activeStep + 1);
  };
  
  // Go back to previous step
  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  // Listing type options
  const listingTypes = [
    {
      type: LISTING_TYPES.BUSINESS,
      title: 'Business',
      description: 'Established businesses with proven revenue and operations',
      icon: <Building size={24} />
    },
    {
      type: LISTING_TYPES.FRANCHISE,
      title: 'Franchise',
      description: 'Franchise opportunities for established brands',
      icon: <Briefcase size={24} />
    },
    {
      type: LISTING_TYPES.STARTUP,
      title: 'Startup',
      description: 'Early-stage companies seeking investment or buyers',
      icon: <TrendingUp size={24} />
    },
    {
      type: LISTING_TYPES.INVESTOR,
      title: 'Investor',
      description: 'Individuals or firms looking to invest in businesses',
      icon: <Users size={24} />
    },
    {
      type: LISTING_TYPES.DIGITAL_ASSET,
      title: 'Digital Asset',
      description: 'Websites, apps, or online businesses for sale',
      icon: <Monitor size={24} />
    }
  ];

  // Loading state
  if (loadingListing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Error state
  if (formError && !listing) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{formError}</p>
          </div>
        </div>
      </div>
    );
  }

  // Form content based on current step
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-bold mb-6">Select Listing Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listingTypes.map((type) => (
                <button
                  key={type.type}
                  className={`p-6 border rounded-lg text-left hover:border-indigo-500 hover:shadow-md transition-all ${
                    formData.type === type.type ? 'border-indigo-500 bg-indigo-50 shadow-md' : ''
                  }`}
                  onClick={() => handleTypeSelect(type.type)}
                >
                  <div className="flex items-center mb-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      {type.icon}
                    </div>
                    <h3 className="ml-3 text-lg font-medium">{type.title}</h3>
                  </div>
                  <p className="text-gray-500 text-sm">{type.description}</p>
                </button>
              ))}
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <h2 className="text-xl font-bold mb-6">Edit Basic Information</h2>
            
            {formError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-start">
                <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md flex items-start">
                <Check size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
            
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Enter ${formData.type === LISTING_TYPES.BUSINESS ? 'business' : formData.type === LISTING_TYPES.FRANCHISE ? 'franchise' : formData.type === LISTING_TYPES.STARTUP ? 'startup' : formData.type === LISTING_TYPES.INVESTOR ? 'investor' : 'digital asset'} name`}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Provide a detailed description"
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.type === LISTING_TYPES.INVESTOR ? 'Investment Amount' : 'Asking Price'} (₹)
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="text"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Food & Beverage, Technology, Real Estate"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
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
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(true)}
                    className="px-4 py-2 border border-red-300 bg-red-50 text-red-700 rounded-md hover:bg-red-100"
                  >
                    <Trash2 size={16} className="mr-1.5 inline-block" />
                    Delete
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            </form>
          </>
        );
        
      case 3:
        return (
          <>
            <h2 className="text-xl font-bold mb-6">Update Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.values(PLAN_TYPES).map((plan) => {
                const features = PLAN_FEATURES[plan];
                return (
                  <div 
                    key={plan}
                    className={`border rounded-lg overflow-hidden transition-all ${
                      formData.plan === plan ? 'border-indigo-500 shadow-md' : 'hover:shadow-md hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-4 text-center ${plan === PLAN_TYPES.BASIC ? 'bg-gray-50' : plan === PLAN_TYPES.STANDARD ? 'bg-indigo-50' : plan === PLAN_TYPES.ADVANCED ? 'bg-purple-50' : 'bg-yellow-50'}`}>
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
                            ? 'bg-indigo-600 text-white'
                            : 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
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
            <h2 className="text-xl font-bold mb-6">Update Images</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="max-w-lg mx-auto">
                <ImageIcon size={48} className="mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Update Images</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop new image files, or click to select files
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
              
              {/* Image preview */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images && formData.images.length > 0 ? (
                  formData.images.map((image, index) => (
                    <div key={index} className="relative h-24 bg-gray-100 rounded-md overflow-hidden group">
                      <img 
                        src={image} 
                        alt={`Listing image ${index + 1}`} 
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        <Trash2 className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No images</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex items-start">
              <Info size={18} className="text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Image upload is optional. You can add or update images later.
              </p>
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
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            </div>
          </>
        );
        
      case 5:
        return (
          <>
            <h2 className="text-xl font-bold mb-6">Review and Update</h2>
            
            {formError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-start">
                <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md flex items-start">
                <Check size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-lg mb-4">Listing Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Listing Type</p>
                  <p className="font-medium">
                    {formData.type === LISTING_TYPES.BUSINESS ? 'Business' : 
                     formData.type === LISTING_TYPES.FRANCHISE ? 'Franchise' : 
                     formData.type === LISTING_TYPES.STARTUP ? 'Startup' : 
                     formData.type === LISTING_TYPES.INVESTOR ? 'Investor' : 
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
                    {formData.type === LISTING_TYPES.INVESTOR ? 'Investment Amount' : 'Asking Price'}
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
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{formData.status}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Selected Plan</p>
                  <p className="font-medium">
                    {PLAN_FEATURES[formData.plan].name} - ₹{PLAN_FEATURES[formData.plan].price}/month
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Images</p>
                  <p className="font-medium">{formData.images.length} images</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <button
                type="button"
                onClick={handleSubmit}
                className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 font-medium ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Listing'}
                <Save size={16} className="ml-2" />
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
        <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
        <p className="text-gray-600 mt-1">
          Update your {formData.type === LISTING_TYPES.BUSINESS ? 'business' : 
                       formData.type === LISTING_TYPES.FRANCHISE ? 'franchise' : 
                       formData.type === LISTING_TYPES.STARTUP ? 'startup' : 
                       formData.type === LISTING_TYPES.INVESTOR ? 'investor' : 
                       'digital asset'} listing
        </p>
      </header>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Progress Steps */}
        <div className="border-b">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex">
              {['Listing Type', 'Basic Info', 'Select Plan', 'Images', 'Review'].map((label, index) => {
                const stepNum = index + 1;
                return (
                  <div key={label} className={`flex-1 ${stepNum < 5 ? 'border-r' : ''}`}>
                    <button
                      className={`w-full py-4 text-center text-sm focus:outline-none ${
                        activeStep === stepNum
                          ? 'font-medium text-indigo-600'
                          : activeStep > stepNum
                          ? 'font-medium text-gray-500'
                          : 'text-gray-400'
                      }`}
                      onClick={() => stepNum < activeStep && setActiveStep(stepNum)}
                      disabled={stepNum > activeStep}
                    >
                      <span className={`mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full ${
                        activeStep === stepNum
                          ? 'bg-indigo-100 text-indigo-600'
                          : activeStep > stepNum
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {activeStep > stepNum ? <Check size={12} /> : stepNum}
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
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Listing
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this listing? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditListingPage;