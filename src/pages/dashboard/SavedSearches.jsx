import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Trash2, 
  PlayCircle, 
  AlertTriangle, 
  X, 
  Filter, 
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useListing } from '../../contexts/ListingContext';
import { APP_ROUTES, LISTING_TYPES } from '../../utils/constants';

/**
 * SavedSearches Component
 * Displays and manages user's saved search queries
 */
function SavedSearchesPage() {
  const { currentUser } = useAuth();
  const { getSavedSearches, deleteSavedSearch, updateSearchLastRun, loading } = useListing();
  const navigate = useNavigate();

  // State for saved searches
  const [savedSearches, setSavedSearches] = useState([]);
  const [error, setError] = useState(null);
  
  // Deletion confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    searchId: null
  });

  // Fetch saved searches on component mount
  useEffect(() => {
    const fetchSavedSearches = async () => {
      try {
        const searches = await getSavedSearches();
        setSavedSearches(searches);
      } catch (err) {
        console.error('Error fetching saved searches:', err);
        setError('Failed to load saved searches. Please try again.');
      }
    };

    fetchSavedSearches();
  }, [currentUser, getSavedSearches]);

  // Format filters for display
  const formatFilters = (filters) => {
    if (!filters) return [];
    
    const formattedFilters = [];
    
    if (filters.location) {
      formattedFilters.push(`Location: ${filters.location}`);
    }
    
    if (filters.priceMin && filters.priceMax) {
      formattedFilters.push(`Price: ₹${parseInt(filters.priceMin).toLocaleString()} - ₹${parseInt(filters.priceMax).toLocaleString()}`);
    } else if (filters.priceMin) {
      formattedFilters.push(`Price: Min ₹${parseInt(filters.priceMin).toLocaleString()}`);
    } else if (filters.priceMax) {
      formattedFilters.push(`Price: Max ₹${parseInt(filters.priceMax).toLocaleString()}`);
    }
    
    if (filters.categories && filters.categories.length > 0) {
      formattedFilters.push(`Categories: ${filters.categories.join(', ')}`);
    }
    
    return formattedFilters;
  };

  // Run a saved search
  const runSearch = async (search) => {
    // Construct the search URL
    const queryParams = new URLSearchParams();
    
    if (search.query) {
      queryParams.set('q', search.query);
    }
    
    if (search.type) {
      queryParams.set('type', search.type);
    }
    
    if (search.filters) {
      if (search.filters.location) {
        queryParams.set('location', search.filters.location);
      }
      
      if (search.filters.priceMin) {
        queryParams.set('price_min', search.filters.priceMin);
      }
      
      if (search.filters.priceMax) {
        queryParams.set('price_max', search.filters.priceMax);
      }
      
      if (search.filters.categories && search.filters.categories.length > 0) {
        queryParams.set('categories', search.filters.categories.join(','));
      }
    }
    
    // Update the last run time
    try {
      await updateSearchLastRun(search.id);
    } catch (err) {
      console.error('Error updating search last run time:', err);
      // Non-critical error, continue with navigation
    }
    
    // Navigate to search results page
    navigate(`${APP_ROUTES.MARKETPLACE.SEARCH}?${queryParams.toString()}`);
  };

  // Delete a saved search
  const handleDeleteSearch = async (searchId) => {
    setDeleteConfirm({ show: false, searchId: null });
    
    try {
      await deleteSavedSearch(searchId);
      setSavedSearches(prev => prev.filter(search => search.id !== searchId));
    } catch (err) {
      console.error('Error deleting saved search:', err);
      setError('Failed to delete saved search. Please try again.');
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
        <h1 className="text-2xl font-bold text-gray-900">Saved Searches</h1>
        <p className="text-gray-600 mt-1">
          View and manage your saved search criteria
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
      
      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-500">Loading saved searches...</p>
        </div>
      ) : savedSearches.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-500 mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved searches</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't saved any searches yet. Save a search to quickly access it later.
          </p>
          <Link
            to={APP_ROUTES.MARKETPLACE.SEARCH}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Search size={16} className="mr-2" />
            Start a New Search
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between p-4 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Your Saved Searches</h2>
              <Link
                to={APP_ROUTES.MARKETPLACE.SEARCH}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                <Search size={16} className="mr-1.5" />
                New Search
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {savedSearches.map((search) => (
              <div key={search.id} className="p-4 sm:p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900 mr-2">{search.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getListingTypeName(search.type)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-1">
                      {search.query ? (
                        <span>Search: "{search.query}"</span>
                      ) : (
                        <span>No search query</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formatFilters(search.filters).map((filter, index) => (
                        <div 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          <Filter size={12} className="mr-1 text-gray-500" />
                          {filter}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center mt-3 text-xs text-gray-500">
                      <span>Created: {search.createdAt.toLocaleDateString()}</span>
                      {search.lastRun && (
                        <span className="ml-4">Last run: {search.lastRun.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col items-center sm:items-end gap-2">
                    <button
                      onClick={() => runSearch(search)}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <PlayCircle size={16} className="mr-1.5" />
                      Run Search
                    </button>
                    
                    <button
                      onClick={() => setDeleteConfirm({ show: true, searchId: search.id })}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Trash2 size={16} className="mr-1.5 text-gray-500" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                    <AlertTriangle size={20} className="text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Saved Search
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this saved search? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDeleteSearch(deleteConfirm.searchId)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteConfirm({ show: false, searchId: null })}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tip Card */}
      <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info size={20} className="text-blue-600" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Pro Tip</h4>
            <p className="mt-1 text-sm text-blue-600">
              You can save any search by clicking the "Save" button on the search results page.
              Saved searches help you quickly find what you're looking for without entering the same criteria again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedSearchesPage;