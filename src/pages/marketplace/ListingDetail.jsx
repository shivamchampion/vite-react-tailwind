import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  Eye, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Building, 
  Briefcase, 
  Lightbulb, 
  Users, 
  Monitor, 
  IndianRupee,
  CheckCircle,
  User,
  Clock,
  AlertTriangle,
  ChevronLeft,
  Star,
  Globe,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useListing } from '../../contexts/ListingContext';
import { APP_ROUTES, LISTING_TYPES } from '../../utils/constants';

/**
 * ListingDetailPage Component
 * Displays detailed information about a specific listing
 */
function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    getListingById, 
    addToRecentlyViewed, 
    addToFavorites, 
    removeFromFavorites,
    loading 
  } = useListing();
  
  // State for listing data
  const [listing, setListing] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [contactFormVisible, setContactFormVisible] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  // Fetch listing data and track view
  useEffect(() => {
    const fetchListingData = async () => {
      try {
        // Get listing details
        const listingData = await getListingById(id);
        
        if (!listingData) {
          setError('Listing not found');
          return;
        }
        
        setListing(listingData);
        
        // Check if this is in user's favorites
        // This would typically be done by calling a backend API
        // For now, we're using a placeholder
        setIsFavorite(listingData.isFavorite || false);
        
        // Add to recently viewed
        if (currentUser) {
          await addToRecentlyViewed(id);
        }
      } catch (err) {
        console.error('Error fetching listing details:', err);
        setError('Failed to load listing details. Please try again.');
      }
    };

    if (id) {
      fetchListingData();
    }
  }, [id, currentUser, getListingById, addToRecentlyViewed]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit contact form
  const handleSubmitContact = async (e) => {
    e.preventDefault();
    
    // This would send a message to the listing owner
    // For now, we'll just show a success message and close the form
    alert('Your message has been sent!');
    setContactFormVisible(false);
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate(`${APP_ROUTES.AUTH.LOGIN}?redirect=${window.location.pathname}`);
      return;
    }
    
    try {
      if (isFavorite) {
        await removeFromFavorites(id);
      } else {
        await addToFavorites(id);
      }
      
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite status:', err);
      setError('Failed to update favorite status. Please try again.');
    }
  };

  // Share listing
  const shareListing = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this ${getListingTypeName(listing.type)}: ${listing.title}`,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Get listing type name
  const getListingTypeName = (type) => {
    switch (type) {
      case LISTING_TYPES.BUSINESS:
        return 'Business';
      case LISTING_TYPES.FRANCHISE:
        return 'Franchise';
      case LISTING_TYPES.STARTUP:
        return 'Startup';
      case LISTING_TYPES.INVESTOR:
        return 'Investor';
      case LISTING_TYPES.DIGITAL_ASSET:
        return 'Digital Asset';
      default:
        return 'Listing';
    }
  };

  // Get listing type icon
  const getListingTypeIcon = (type) => {
    switch (type) {
      case LISTING_TYPES.BUSINESS:
        return <Building size={20} />;
      case LISTING_TYPES.FRANCHISE:
        return <Briefcase size={20} />;
      case LISTING_TYPES.STARTUP:
        return <Lightbulb size={20} />;
      case LISTING_TYPES.INVESTOR:
        return <Users size={20} />;
      case LISTING_TYPES.DIGITAL_ASSET:
        return <Monitor size={20} />;
      default:
        return <Building size={20} />;
    }
  };

  // Format a date to local format
  const formatDate = (dateObj) => {
    if (!dateObj) return 'Unknown date';
    return dateObj instanceof Date 
      ? dateObj.toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : 'Unknown date';
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Link 
            to={APP_ROUTES.MARKETPLACE.BUSINESS}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ChevronLeft className="w-4 h-4 mr-1.5" />
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  // If no listing data yet
  if (!listing) {
    return null;
  }

  // Prepare placeholder images if needed
  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : [
        `https://picsum.photos/seed/${id}-1/800/600`,
        `https://picsum.photos/seed/${id}-2/800/600`,
        `https://picsum.photos/seed/${id}-3/800/600`
      ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <nav className="flex items-center text-sm text-gray-500">
          <Link to={APP_ROUTES.HOME} className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to={APP_ROUTES.MARKETPLACE.BUSINESS} className="hover:text-indigo-600">Marketplace</Link>
          <span className="mx-2">/</span>
          <Link 
            to={listing.type === LISTING_TYPES.BUSINESS 
              ? APP_ROUTES.MARKETPLACE.BUSINESS
              : listing.type === LISTING_TYPES.FRANCHISE
              ? APP_ROUTES.MARKETPLACE.FRANCHISE
              : listing.type === LISTING_TYPES.STARTUP
              ? APP_ROUTES.MARKETPLACE.STARTUP
              : listing.type === LISTING_TYPES.INVESTOR
              ? APP_ROUTES.MARKETPLACE.INVESTOR
              : APP_ROUTES.MARKETPLACE.DIGITAL_ASSET
            } 
            className="hover:text-indigo-600"
          >
            {getListingTypeName(listing.type)}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{listing.title}</span>
        </nav>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="relative aspect-w-16 aspect-h-9 bg-gray-100">
              <img 
                src={images[activeImage]}
                alt={`${listing.title} - Image ${activeImage + 1}`}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button 
                  onClick={toggleFavorite}
                  className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-red-500 focus:outline-none"
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                
                <button 
                  onClick={shareListing}
                  className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-indigo-500 focus:outline-none"
                  title="Share listing"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="p-4 flex overflow-x-auto space-x-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                      activeImage === index ? 'border-indigo-500' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Listing Details */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {getListingTypeName(listing.type)}
                    </span>
                    
                    {listing.plan === 'premium' && (
                      <span className="ml-2 px-2.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        Premium
                      </span>
                    )}
                    
                    {listing.verified && (
                      <span className="ml-2 px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{listing.location}</span>
                  </div>
                </div>
                
                <div className="mt-2 sm:mt-0">
                  <div className="text-xl sm:text-2xl font-bold text-indigo-600 flex items-center">
                    <IndianRupee className="w-5 h-5 mr-1" />
                    <span>{listing.price}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <div className="prose max-w-none text-gray-600">
                  <p>{listing.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                  <p className="text-gray-900">{listing.category}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Established</h3>
                  <p className="text-gray-900">{listing.established || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Revenue</h3>
                  <p className="text-gray-900">₹{listing.revenue || 'Not disclosed'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Employees</h3>
                  <p className="text-gray-900">{listing.employees || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Listed On</h3>
                  <p className="text-gray-900">{formatDate(listing.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Views</h3>
                  <p className="text-gray-900 flex items-center">
                    <Eye className="w-4 h-4 mr-1.5 text-gray-400" />
                    {listing.views || 0}
                  </p>
                </div>
              </div>
              
              {/* Key Features */}
              {listing.features && listing.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {listing.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Call to action */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setContactFormVisible(true)}
                  className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Owner
                </button>
                
                <button
                  onClick={toggleFavorite}
                  className={`flex-1 inline-flex justify-center items-center px-6 py-3 border rounded-md shadow-sm text-base font-medium ${
                    isFavorite 
                      ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Additional Information */}
          {listing.additionalInfo && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                <div className="prose max-w-none text-gray-600">
                  <p>{listing.additionalInfo}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Documents/Attachments */}
          {listing.documents && listing.documents.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
                <div className="space-y-3">
                  {listing.documents.map((doc, index) => (
                    <a 
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <FileText className="w-5 h-5 text-indigo-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column - Owner Info and Similar Listings */}
        <div>
          {/* Owner Information */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h2>
              
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  {listing.ownerImage ? (
                    <img 
                      src={listing.ownerImage}
                      alt={listing.ownerName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-indigo-600" />
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-base font-medium text-gray-900">{listing.ownerName || 'Business Owner'}</h3>
                  <p className="text-sm text-gray-500">Member since {listing.ownerJoinDate 
                    ? formatDate(listing.ownerJoinDate) 
                    : new Date().getFullYear()}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {listing.ownerPhone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{listing.ownerPhone}</span>
                  </div>
                )}
                
                {listing.ownerEmail && (
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{listing.ownerEmail}</span>
                  </div>
                )}
                
                {listing.ownerWebsite && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-400 mr-3" />
                    <a 
                      href={listing.ownerWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {listing.ownerWebsite.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setContactFormVisible(true)}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <MessageSquare className="w-4 h-4 mr-1.5" />
                Contact Owner
              </button>
            </div>
          </div>
          
          {/* Listing Details Summary */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Listing Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-500">ID</div>
                  <div className="text-sm text-gray-900">{listing.id}</div>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-500">Type</div>
                  <div className="text-sm text-gray-900">{getListingTypeName(listing.type)}</div>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-500">Location</div>
                  <div className="text-sm text-gray-900">{listing.location}</div>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-500">Listed</div>
                  <div className="text-sm text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                    {formatDate(listing.createdAt)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-500">Views</div>
                  <div className="text-sm text-gray-900 flex items-center">
                    <Eye className="w-4 h-4 mr-1.5 text-gray-400" />
                    {listing.views || 0}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-500">Last Updated</div>
                  <div className="text-sm text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                    {formatDate(listing.updatedAt || listing.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Similar Listings */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Similar Listings</h2>
              
              {listing.similarListings && listing.similarListings.length > 0 ? (
                <div className="space-y-4">
                  {listing.similarListings.map((item) => (
                    <Link 
                      key={item.id}
                      to={`${APP_ROUTES.MARKETPLACE.DETAIL}/${item.id}`}
                      className="block group"
                    >
                      <div className="flex items-start">
                        <div className="h-16 w-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image || `https://picsum.photos/seed/${item.id}/100/100`}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">{item.location}</p>
                          <p className="text-sm font-medium text-indigo-600 mt-1">₹{item.price}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-md">
                  <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No similar listings found</p>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Link
                  to={listing.type === LISTING_TYPES.BUSINESS 
                    ? APP_ROUTES.MARKETPLACE.BUSINESS
                    : listing.type === LISTING_TYPES.FRANCHISE
                    ? APP_ROUTES.MARKETPLACE.FRANCHISE
                    : listing.type === LISTING_TYPES.STARTUP
                    ? APP_ROUTES.MARKETPLACE.STARTUP
                    : listing.type === LISTING_TYPES.INVESTOR
                    ? APP_ROUTES.MARKETPLACE.INVESTOR
                    : APP_ROUTES.MARKETPLACE.DIGITAL_ASSET
                  }
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  View more {getListingTypeName(listing.type).toLowerCase()}s
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Form Modal */}
      {contactFormVisible && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Contact Owner
                    </h3>
                    
                    <div className="mt-4">
                      <form onSubmit={handleSubmitContact}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={contactForm.name}
                              onChange={handleInputChange}
                              required
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={contactForm.email}
                              onChange={handleInputChange}
                              required
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={contactForm.phone}
                              onChange={handleInputChange}
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea
                              id="message"
                              name="message"
                              rows="4"
                              value={contactForm.message}
                              onChange={handleInputChange}
                              required
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              placeholder={`I'm interested in this ${getListingTypeName(listing.type).toLowerCase()} and would like to know more details.`}
                            ></textarea>
                          </div>
                        </div>
                        
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Send Message
                          </button>
                          <button
                            type="button"
                            onClick={() => setContactFormVisible(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListingDetailPage;