import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Heart,
  Map,
  Phone,
  Mail,
  Calendar,
  Building,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  User,
  Shield,
  Globe,
  DollarSign,
  Clock,
  Users,
  Star,
  MessageSquare,
  Send
} from 'lucide-react';
import { APP_ROUTES, ENTITY_TYPES } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

/**
 * EntityDetailPage Component
 * Displays detailed information about a specific entity with working contact functionality
 */
function EntityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useOutletContext() || {};

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [entity, setEntity] = useState(null);
  const [wished, setWished] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Fetch entity data
  useEffect(() => {
    const fetchEntityData = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call
        // For demonstration, we're creating mock data

        // Determine entity type from ID if possible
        const entityTypeFromId = id.split('-')[0] || '';
        const entityType = Object.values(ENTITY_TYPES).includes(entityTypeFromId)
          ? entityTypeFromId
          : ENTITY_TYPES.BUSINESS;

        // Create a title based on entity type
        let entityTitle = 'Sample Business';
        if (entityType === ENTITY_TYPES.FRANCHISE) entityTitle = 'Premium Franchise Opportunity';
        if (entityType === ENTITY_TYPES.STARTUP) entityTitle = 'Innovative Tech Startup';
        if (entityType === ENTITY_TYPES.INVESTOR) entityTitle = 'Angel Investor - Tech Focused';
        if (entityType === ENTITY_TYPES.DIGITAL_ASSET) entityTitle = 'E-commerce Website For Sale';

        // Set the entity data
        setEntity({
          id: id,
          type: entityType,
          title: entityTitle,
          description: 'This is a detailed description of this business opportunity. It highlights the key features, market position, and potential for growth. The business has been operating successfully for several years and has established a loyal customer base with consistent revenue.',
          longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at risus ut augue hendrerit feugiat. In hac habitasse platea dictumst. Suspendisse molestie ipsum ac mollis lobortis. Vestibulum interdum ex quis tincidunt aliquam. Sed condimentum ipsum quis felis ullamcorper, sit amet finibus lectus facilisis. Fusce sagittis ante vel quam eleifend, vel porttitor nulla porttitor.\n\nProin vel consectetur velit. Morbi sodales, odio sit amet finibus condimentum, urna turpis congue eros, eu suscipit eros magna in quam. Nam pharetra consectetur est et fermentum. Nullam gravida facilisis augue, non lobortis lacus auctor ut. Donec semper ligula a justo sollicitudin, non tincidunt leo vulputate.',
          price: entityType === ENTITY_TYPES.INVESTOR ? 'Investment Range: ₹50 Lakh - 2 Crore' : '₹75,00,000',
          location: 'Mumbai, Maharashtra',
          category: entityType === ENTITY_TYPES.BUSINESS ? 'Food & Beverage' :
            entityType === ENTITY_TYPES.FRANCHISE ? 'Retail Franchise' :
              entityType === ENTITY_TYPES.STARTUP ? 'Tech/SaaS' :
                entityType === ENTITY_TYPES.INVESTOR ? 'Angel Investor' : 'E-commerce',
          establishedYear: entityType === ENTITY_TYPES.INVESTOR ? 'Investing since 2015' : '2015',
          revenue: entityType !== ENTITY_TYPES.INVESTOR ? '1.2 Cr annually' : null,
          employees: entityType !== ENTITY_TYPES.INVESTOR ? '15-20' : null,
          investmentPortfolio: entityType === ENTITY_TYPES.INVESTOR ? '15+ companies' : null,
          investmentFocus: entityType === ENTITY_TYPES.INVESTOR ? 'Early-stage tech startups' : null,
          planType: 'Premium',
          rating: '4.5',
          views: 245,
          connects: 12,
          images: [1, 2, 3, 4], // Placeholder for image IDs
          features: [
            'Prime location with high foot traffic',
            'Fully equipped and operational',
            'Loyal customer base',
            'Trained staff willing to continue',
            'Established supply chain',
            'Strong online presence'
          ],
          owner: {
            name: 'John Doe',
            title: 'Owner',
            since: '2015',
            verified: true
          },
          socialMedia: {
            facebook: { handle: 'businessFB', verified: true },
            twitter: { handle: '@businessTwitter', verified: false },
            instagram: { handle: '@businessInsta', verified: true }
          }
        });
      } catch (error) {
        console.error('Error fetching entity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntityData();
  }, [id]);

  // Get entity type display name
  const getEntityTypeDisplay = (type) => {
    switch (type) {
      case ENTITY_TYPES.BUSINESS: return 'Business';
      case ENTITY_TYPES.FRANCHISE: return 'Franchise';
      case ENTITY_TYPES.STARTUP: return 'Startup';
      case ENTITY_TYPES.INVESTOR: return 'Investor';
      case ENTITY_TYPES.DIGITAL_ASSET: return 'Digital Asset';
      default: return 'Business';
    }
  };

  // Toggle wishlist status
  const toggleWishlist = () => {
    if (isAuthenticated) {
      setWished(!wished);
    } else {
      // Prompt login if not authenticated
      if (typeof openAuthModal === 'function') {
        openAuthModal('login');
      } else {
        navigate(APP_ROUTES.HOME);
      }
    }
  };

  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // Prompt login if not authenticated
      if (typeof openAuthModal === 'function') {
        openAuthModal('login');
      } else {
        navigate(APP_ROUTES.HOME);
      }
      return;
    }

    if (!contactMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    // In a real app, this would send the message to the API
    alert(`Your message has been sent to the ${getEntityTypeDisplay(entity.type)} owner!`);
    setContactMessage('');
  };

  // Share functionality
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  // Render share options
  const renderShareOptions = () => {
    if (!showShareOptions) return null;

    return (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
        <div className="py-1">
          <button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Copy Link
          </button>
          <button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Share on Facebook
          </button>
          <button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Share on Twitter
          </button>
          <button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Share on WhatsApp
          </button>
        </div>
      </div>
    );
  };

  // Display loading state
  if (loading) {
    return (
      <div className="py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If entity is not found
  if (!entity) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Entity Not Found</h1>
            <p className="text-gray-600 mb-6">The entity you're looking for doesn't exist or has been removed.</p>
            <Link to={APP_ROUTES.HOME} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render the entity detail page
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button and actions */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to={
              entity.type === ENTITY_TYPES.BUSINESS ? APP_ROUTES.MARKETPLACE.BUSINESS :
                entity.type === ENTITY_TYPES.FRANCHISE ? APP_ROUTES.MARKETPLACE.FRANCHISE :
                  entity.type === ENTITY_TYPES.STARTUP ? APP_ROUTES.MARKETPLACE.STARTUP :
                    entity.type === ENTITY_TYPES.INVESTOR ? APP_ROUTES.MARKETPLACE.INVESTOR :
                      APP_ROUTES.MARKETPLACE.DIGITAL_ASSET
            }
            className="flex items-center text-blue-600"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Listings
          </Link>

          <div className="flex space-x-2">
            <div className="relative">
              <button
                className="p-2 rounded-full border hover:bg-gray-50"
                onClick={handleShare}
              >
                <Share2 size={16} />
              </button>
              {renderShareOptions()}
            </div>
            <button
              className={`p-2 rounded-full border hover:bg-gray-50 ${wished ? 'text-red-500' : ''}`}
              onClick={toggleWishlist}
            >
              <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Entity Title and Basic Info */}
        <div className="mb-6">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900">{entity.title}</h1>
            {entity.planType === 'Premium' && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-300">
                Premium
              </span>
            )}
          </div>
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
            <div className="flex items-center text-yellow-500 ml-4">
              <Star size={16} className="mr-1" fill="currentColor" />
              <span>{entity.rating}/5</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4 md:col-span-2 h-80 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={`https://picsum.photos/seed/${entity.id}/800/600`}
                alt={entity.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
                }}
              />
            </div>
            {entity.images.slice(1).map((_, index) => (
              <div key={index} className="h-40 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={`https://picsum.photos/seed/${entity.id}-${index + 1}/400/300`}
                  alt={`${entity.title} ${index + 2}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
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
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
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
            <div>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">{getEntityTypeDisplay(entity.type)} Overview</h3>
                  <p className="text-gray-700 mb-6">
                    {entity.description}
                  </p>

                  <p className="text-gray-700 mb-6">
                    {entity.longDescription}
                  </p>

                  <h3 className="text-xl font-bold mb-4">Key Features</h3>
                  <ul className="list-disc pl-5 mb-6 space-y-1">
                    {entity.features.map((feature, index) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>

                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex items-start">
                      <CheckCircle2 size={20} className="text-blue-600 mr-3 mt-0.5" />
                      <p className="text-sm text-blue-600">
                        This listing has been verified by our team. The {getEntityTypeDisplay(entity.type).toLowerCase()} details have been checked and confirmed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Financials Tab */}
              {activeTab === 'financials' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Financial Information</h3>
                  <p className="text-gray-700 mb-6">
                    Below is a summary of the financial performance of this {
                      entity.type === ENTITY_TYPES.BUSINESS ? 'business' :
                        entity.type === ENTITY_TYPES.FRANCHISE ? 'franchise opportunity' :
                          entity.type === ENTITY_TYPES.STARTUP ? 'startup' :
                            entity.type === ENTITY_TYPES.INVESTOR ? 'investor portfolio' : 'digital asset'
                    }.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {entity.revenue && (
                      <div className="border rounded-md p-4">
                        <h4 className="text-lg font-semibold mb-2">Revenue</h4>
                        <p className="text-3xl font-bold text-blue-600">{entity.revenue}</p>
                        <p className="text-sm text-gray-500">Annual revenue</p>
                      </div>
                    )}

                    {entity.type !== ENTITY_TYPES.INVESTOR && (
                      <div className="border rounded-md p-4">
                        <h4 className="text-lg font-semibold mb-2">Profit</h4>
                        <p className="text-3xl font-bold text-green-600">₹28 Lakh</p>
                        <p className="text-sm text-gray-500">Annual profit</p>
                      </div>
                    )}

                    {entity.investmentPortfolio && (
                      <div className="border rounded-md p-4">
                        <h4 className="text-lg font-semibold mb-2">Portfolio Size</h4>
                        <p className="text-3xl font-bold text-purple-600">{entity.investmentPortfolio}</p>
                        <p className="text-sm text-gray-500">Current investments</p>
                      </div>
                    )}

                    {entity.employees && (
                      <div className="border rounded-md p-4">
                        <h4 className="text-lg font-semibold mb-2">Team Size</h4>
                        <p className="text-3xl font-bold text-indigo-600">{entity.employees}</p>
                        <p className="text-sm text-gray-500">Employees</p>
                      </div>
                    )}

                    {entity.investmentFocus && (
                      <div className="border rounded-md p-4 md:col-span-2">
                        <h4 className="text-lg font-semibold mb-2">Investment Focus</h4>
                        <p className="text-xl font-medium text-gray-800">{entity.investmentFocus}</p>
                        <p className="text-sm text-gray-500">Primary investment area</p>
                      </div>
                    )}
                  </div>

                  {entity.type !== ENTITY_TYPES.INVESTOR && (
                    <div className="bg-yellow-50 p-4 rounded-md mb-4">
                      <div className="flex items-start">
                        <AlertCircle size={20} className="text-yellow-600 mr-3 mt-0.5" />
                        <p className="text-sm text-yellow-700">
                          Detailed financial statements are available upon request after signing an NDA.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">{getEntityTypeDisplay(entity.type)} Documents</h3>

                  {isAuthenticated ? (
                    <div>
                      <p className="text-gray-700 mb-6">
                        The following documents are available for this {getEntityTypeDisplay(entity.type).toLowerCase()}. Some documents may require additional verification or an NDA.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="border rounded-md p-4 flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mr-3">
                            <Shield size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium">Verification Documents</h4>
                            <p className="text-sm text-gray-500">Business registration, licenses</p>
                          </div>
                        </div>

                        <div className="border rounded-md p-4 flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center text-green-600 mr-3">
                            <DollarSign size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium">Financial Statements</h4>
                            <p className="text-sm text-gray-500">P&L, balance sheets (NDA required)</p>
                          </div>
                        </div>

                        <div className="border rounded-md p-4 flex items-center">
                          <div className="w-10 h-10 bg-yellow-100 rounded-md flex items-center justify-center text-yellow-600 mr-3">
                            <Users size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium">Team Overview</h4>
                            <p className="text-sm text-gray-500">Organization structure, roles</p>
                          </div>
                        </div>

                        <div className="border rounded-md p-4 flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center text-purple-600 mr-3">
                            <Globe size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium">Market Analysis</h4>
                            <p className="text-sm text-gray-500">Market position, competition</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-md mb-6">
                        <div className="flex items-start">
                          <MessageSquare size={20} className="text-blue-600 mr-3 mt-0.5" />
                          <p className="text-sm text-blue-600">
                            To request specific documents, please contact the {getEntityTypeDisplay(entity.type).toLowerCase()} owner directly through the Contact tab.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-yellow-200 bg-yellow-50 p-6 rounded-md">
                      <div className="flex items-start">
                        <AlertCircle size={24} className="text-yellow-600 mr-4" />
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-2">Authentication Required</h4>
                          <p className="text-yellow-700 mb-4">
                            Please log in or register to view documents related to this {getEntityTypeDisplay(entity.type).toLowerCase()}.
                          </p>
                          <div className="flex space-x-4">
                            <button
                              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                              onClick={() => openAuthModal('login')}
                            >
                              Login
                            </button>
                            <button
                              className="px-4 py-2 border border-yellow-600 text-yellow-600 rounded-md hover:bg-yellow-100"
                              onClick={() => openAuthModal('register')}
                            >
                              Register
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Contact {getEntityTypeDisplay(entity.type)} Owner</h3>

                  {isAuthenticated ? (
                    <div>
                      <p className="text-gray-700 mb-6">
                        Fill out the form below to connect with the {getEntityTypeDisplay(entity.type).toLowerCase()} owner. Your first message will use 1 connect from your account.
                      </p>

                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Message
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            placeholder={`I'm interested in your ${getEntityTypeDisplay(entity.type).toLowerCase()} and would like to know more about...`}
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            required
                          ></textarea>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            <span className="flex items-center">
                              <MessageSquare size={14} className="mr-1" />
                              Uses 1 connect
                            </span>
                          </div>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                          >
                            <Send size={16} className="mr-2" />
                            Send Message
                          </button>
                        </div>
                      </form>

                      <div className="mt-8 p-4 bg-gray-50 rounded-md">
                        <h4 className="font-medium text-gray-800 mb-2">Additional Contact Options</h4>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-all">
                            <Phone size={16} className="text-green-600" />
                            <span>Request Phone Call</span>
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-all">
                            <Mail size={16} className="text-blue-600" />
                            <span>Send Email</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-yellow-200 bg-yellow-50 p-6 rounded-md">
                      <div className="flex items-start">
                        <AlertCircle size={24} className="text-yellow-600 mr-4" />
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-2">Authentication Required</h4>
                          <p className="text-yellow-700 mb-4">
                            Please log in or register to contact the {getEntityTypeDisplay(entity.type).toLowerCase()} owner directly.
                          </p>
                          <div className="flex space-x-4">
                            <button
                              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                              onClick={() => openAuthModal('login')}
                            >
                              Login
                            </button>
                            <button
                              className="px-4 py-2 border border-yellow-600 text-yellow-600 rounded-md hover:bg-yellow-100"
                              onClick={() => openAuthModal('register')}
                            >
                              Register
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-8">
              <div className="border rounded-lg overflow-hidden mb-6">
                <div className="bg-gray-50 px-4 py-5 border-b">
                  <div className="text-3xl font-bold text-gray-900">{entity.price}</div>
                  <p className="text-gray-500">
                    {entity.type === ENTITY_TYPES.INVESTOR ? 'Investment Range' : 'Asking Price'}
                  </p>
                </div>

                <div className="p-4 space-y-4">
                  {/* Entity Stats */}
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">
                      {entity.type === ENTITY_TYPES.INVESTOR ? 'Portfolio Size' : 'Monthly Revenue'}
                    </span>
                    <span className="font-semibold">
                      {entity.type === ENTITY_TYPES.INVESTOR ? entity.investmentPortfolio : '₹10 Lakh'}
                    </span>
                  </div>

                  {entity.employees && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Employees</span>
                      <span className="font-semibold">{entity.employees}</span>
                    </div>
                  )}

                  {entity.type !== ENTITY_TYPES.INVESTOR && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Growth Rate</span>
                      <span className="font-semibold text-green-600 flex items-center">
                        <TrendingUp size={16} className="mr-1" />
                        12%
                      </span>
                    </div>
                  )}

                  {/* Owner Contact */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold mb-3">{getEntityTypeDisplay(entity.type)} Owner</h3>

                    <div className="flex items-center mb-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{entity.owner.name}</p>
                        <p className="text-sm text-gray-500">{entity.owner.title} since {entity.owner.since}</p>
                      </div>
                    </div>

                    <button
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-2"
                      onClick={() => setActiveTab('contact')}
                    >
                      Contact {getEntityTypeDisplay(entity.type)} Owner
                    </button>

                    <div className="flex justify-between">
                      <button
                        className="flex items-center text-blue-600 text-sm"
                        onClick={() => setActiveTab('contact')}
                      >
                        <Phone size={16} className="mr-1" />
                        Call
                      </button>
                      <button
                        className="flex items-center text-blue-600 text-sm"
                        onClick={() => setActiveTab('contact')}
                      >
                        <Mail size={16} className="mr-1" />
                        Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Similar Listings */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-semibold">Similar {getEntityTypeDisplay(entity.type)}s</h3>
                </div>

                <div className="divide-y">
                  {[1, 2, 3].map((index) => (
                    <Link
                      key={index}
                      to={`${APP_ROUTES.MARKETPLACE.DETAIL}/${entity.type}-${index}`}
                      className="block p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-start">
                        <div className="h-12 w-12 rounded-md bg-gray-200 mr-3 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-800">Similar {getEntityTypeDisplay(entity.type)} {index}</p>
                          <p className="text-sm text-gray-500">₹{60 + (index * 10)},00,000</p>
                        </div>
                      </div>
                    </Link>
                  ))}
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