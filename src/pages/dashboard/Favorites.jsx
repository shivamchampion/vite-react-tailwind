import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Trash2, 
  Eye, 
  MessageSquare, 
  AlertTriangle, 
  X, 
  MapPin, 
  Star, 
  Building, 
  Briefcase, 
  Lightbulb, 
  Users, 
  Monitor, 
  IndianRupee,
  Filter
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useListing } from '../../contexts/ListingContext';
import { APP_ROUTES, LISTING_TYPES } from '../../utils/constants';

/**
 * FavoritesPage Component
 * Displays and manages user's favorite listings
 */
function FavoritesPage() {
  const { currentUser } = useAuth();
  const { getFavorites, removeFromFavorites, loading } = useListing();
  
  // State for favorites
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  
  // State for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    itemId: null
  });

  // Fetch favorites on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoritesData = await getFavorites();
        setFavorites(favoritesData);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites. Please try again.');
      }
    };

    fetchFavorites();
  }, [currentUser, getFavorites]);

  // Filter favorites by type
  const filteredFavorites = filterType === 'all' 
    ? favorites 
    : favorites.filter(item => item.type === filterType);

  // Remove from favorites
  const removeFavorite = async (itemId) => {
    setDeleteConfirm({ show: false, itemId: null });
    
    try {
      await removeFromFavorites(itemId);
      setFavorites(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove item from favorites. Please try again.');
    }
  };

  // Get listing type icon
  const getListingIcon = (type) => {
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

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
        <p className="text-gray-600 mt-1">
          View and manage your saved listings
        </p>
      </header>
      
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 rounded-md text-red-600 flex items-center">
          <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {/* Filter controls */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            filterType === 'all'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Types
        </button>
        
        <button
          onClick={() => setFilterType(LISTING_TYPES.BUSINESS)}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            filterType === LISTING_TYPES.BUSINESS
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Building size={16} className="mr-1.5" />
          Businesses
        </button>
        
        <button
          onClick={() => setFilterType(LISTING_TYPES.FRANCHISE)}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            filterType === LISTING_TYPES.FRANCHISE
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Briefcase size={16} className="mr-1.5" />
          Franchises
        </button>
        
        <button
          onClick={() => setFilterType(LISTING_TYPES.STARTUP)}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            filterType === LISTING_TYPES.STARTUP
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Lightbulb size={16} className="mr-1.5" />
          Startups
        </button>
        
        <button
          onClick={() => setFilterType(LISTING_TYPES.INVESTOR)}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            filterType === LISTING_TYPES.INVESTOR
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Users size={16} className="mr-1.5" />
          Investors
        </button>
        
        <button
          onClick={() => setFilterType(LISTING_TYPES.DIGITAL_ASSET)}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
            filterType === LISTING_TYPES.DIGITAL_ASSET
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Monitor size={16} className="mr-1.5" />
          Digital Assets
        </button>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-500">Loading favorites...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
            <Heart size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't saved any listings to your favorites yet. Browse listings and click the heart icon to save them here.
          </p>
          <Link
            to={APP_ROUTES.MARKETPLACE.BUSINESS}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Listings
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites match your filter</h3>
          <p className="text-gray-500 mb-6">
            You don't have any favorites of this type. Try changing the filter or browse more listings.
          </p>
          <button
            onClick={() => setFilterType('all')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Show All Favorites
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((item) => (
            <div 
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative h-48 bg-gray-200">
                <img 
                  src={item.image || `https://picsum.photos/seed/${item.id}/300/200`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => setDeleteConfirm({ show: true, itemId: item.id })}
                    className="p-1.5 bg-white rounded-full text-red-500 hover:text-red-700 shadow-sm"
                    title="Remove from favorites"
                  >
                    <Heart size={18} className="fill-current" />
                  </button>
                </div>
                
                <div className="absolute top-2 left-2">
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                    {getListingTypeName(item.type)}
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center text-white">
                    <div className="flex items-center mr-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-sm">{item.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  <Link 
                    to={`${APP_ROUTES.MARKETPLACE.DETAIL}/${item.id}`}
                    className="hover:text-indigo-600"
                  >
                    {item.title}
                  </Link>
                </h3>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin size={14} className="mr-1" />
                  <span>{item.location}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.categories && item.categories.map((category, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      <Filter size={10} className="mr-1" />
                      {category}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-gray-900 flex items-center">
                    <IndianRupee size={14} className="mr-0.5" />
                    <span>{item.price}</span>
                  </div>
                  {item.savedAt && (
                    <div className="text-xs text-gray-500">
                      Saved {item.savedAt.toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`${APP_ROUTES.MARKETPLACE.DETAIL}/${item.id}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Eye size={16} className="mr-1.5" />
                    View Details
                  </Link>
                  
                  <Link
                    to={`${APP_ROUTES.DASHBOARD.MESSAGES}?listing=${item.id}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <MessageSquare size={16} className="mr-1.5" />
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
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
                    <Heart size={20} className="text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Remove from Favorites
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to remove this item from your favorites? This will not delete the listing itself.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => removeFavorite(deleteConfirm.itemId)}
                >
                  Remove
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteConfirm({ show: false, itemId: null })}
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

export default FavoritesPage;