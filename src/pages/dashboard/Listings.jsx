import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Briefcase,
  Lightbulb,
  Monitor,
  Users,
  PlusCircle, 
  Edit2, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  ArrowDown, 
  ArrowUp, 
  MoreHorizontal,
  Star,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useListing } from '../../contexts/ListingContext';
import { APP_ROUTES, LISTING_TYPES, PLAN_TYPES } from '../../utils/constants';

/**
 * ListingsPage Component
 * Displays and manages user's listings
 */
function ListingsPage() {
  const { userListings, loading, deleteListing } = useListing();
  
  // Listing filtering and sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeListing, setActiveListing] = useState(null);
  
  // Handle delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  // Get the appropriate icon for listing type
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
  
  // Filter and sort listings
  const filteredListings = userListings
    ? userListings
        .filter(listing => {
          // Filter by search term
          const matchesSearch = listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
          
          // Filter by type
          const matchesType = filterType === 'all' || listing.type === filterType;
          
          return matchesSearch && matchesType;
        })
        .sort((a, b) => {
          // Sort by selected field
          const aValue = a[sortBy];
          const bValue = b[sortBy];
          
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        })
    : [];
  
  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // Handle delete listing
  const handleDeleteClick = (listing) => {
    setListingToDelete(listing);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (listingToDelete) {
      try {
        await deleteListing(listingToDelete.id);
        setShowDeleteConfirm(false);
        setListingToDelete(null);
        setDeleteSuccess(true);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setDeleteSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setListingToDelete(null);
  };
  
  // Listing type names for display
  const listingTypeNames = {
    [LISTING_TYPES.BUSINESS]: 'Business',
    [LISTING_TYPES.FRANCHISE]: 'Franchise',
    [LISTING_TYPES.STARTUP]: 'Startup',
    [LISTING_TYPES.INVESTOR]: 'Investor',
    [LISTING_TYPES.DIGITAL_ASSET]: 'Digital Asset'
  };
  
  // Plan style classes
  const planStyles = {
    [PLAN_TYPES.BASIC]: 'bg-gray-100 text-gray-800',
    [PLAN_TYPES.ADVANCED]: 'bg-blue-100 text-blue-800',
    [PLAN_TYPES.PREMIUM]: 'bg-purple-100 text-purple-800',
    [PLAN_TYPES.PLATINUM]: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div>
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600 mt-1">
            Manage all your business listings in one place
          </p>
        </div>
        
        <Link
          to={APP_ROUTES.DASHBOARD.ADD_LISTING}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle size={16} className="mr-2" />
          Add New Listing
        </Link>
      </header>
      
      {/* Success message for deletion */}
      {deleteSuccess && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md flex items-start">
          <CheckCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>Listing deleted successfully!</span>
        </div>
      )}
      
      {/* Filters and Search */}
      <div className="bg-white shadow-sm rounded-lg mb-8">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search listings..."
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Types</option>
                <option value={LISTING_TYPES.BUSINESS}>Business</option>
                <option value={LISTING_TYPES.FRANCHISE}>Franchise</option>
                <option value={LISTING_TYPES.STARTUP}>Startup</option>
                <option value={LISTING_TYPES.INVESTOR}>Investor</option>
                <option value={LISTING_TYPES.DIGITAL_ASSET}>Digital Asset</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ArrowDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Listings Grid */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-500">Loading your listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Building size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No listings found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all'
                ? 'Try changing your search or filter settings'
                : 'You have not created any listings yet'}
            </p>
            {!searchTerm && filterType === 'all' && (
              <Link
                to={APP_ROUTES.DASHBOARD.ADD_LISTING}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle size={16} className="mr-2" />
                Add Your First Listing
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredListings.map((listing, index) => (
              <div 
                key={listing.id || index} 
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-40 bg-gray-200">
                  <img 
                    src={listing.image || `https://picsum.photos/seed/list${index}/600/400`}
                    alt={listing.title || `Listing #${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Plan Badge */}
                  <div className={`absolute top-2 right-2 ${planStyles[listing.plan] || planStyles[PLAN_TYPES.BASIC]} px-2 py-1 rounded-full text-xs font-medium`}>
                    {listing.plan?.charAt(0).toUpperCase() + listing.plan?.slice(1) || 'Basic'}
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                    listing.status === 'active' ? 'bg-green-100 text-green-800' : 
                    listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.status?.charAt(0).toUpperCase() + listing.status?.slice(1) || 'Active'}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <span className="flex items-center text-sm text-gray-500">
                      {getListingIcon(listing.type || LISTING_TYPES.BUSINESS)}
                      <span className="ml-1.5">{listingTypeNames[listing.type] || 'Business'}</span>
                    </span>
                    
                    {listing.createdAt && (
                      <span className="ml-auto text-xs text-gray-500">
                        <Calendar size={12} className="inline-block mr-1" />
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">
                    {listing.title || `Listing #${index + 1}`}
                  </h3>
                  
                  {listing.location && (
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin size={14} className="text-gray-400 mr-1" />
                      <span className="line-clamp-1">{listing.location}</span>
                    </div>
                  )}
                  
                  {listing.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {listing.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm">
                      <Eye size={16} className="text-gray-400 mr-1" />
                      <span>{listing.views || 0} views</span>
                    </div>
                    
                    {listing.rating && (
                      <div className="flex items-center text-sm">
                        <Star size={16} className="text-yellow-400 mr-1" />
                        <span>{listing.rating}/5</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`${APP_ROUTES.MARKETPLACE.DETAIL}/${listing.id}`}
                      className="flex-1 inline-flex items-center justify-center px-2 py-1.5 border border-transparent rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye size={14} className="mr-1.5" />
                      View
                    </Link>
                    <Link
                      to={`${APP_ROUTES.DASHBOARD.EDIT_LISTING}/${listing.id}`}
                      className="flex-1 inline-flex items-center justify-center px-2 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Edit2 size={14} className="mr-1.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(listing)}
                      className="inline-flex items-center justify-center px-2 py-1.5 border border-gray-300 rounded text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
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
                    <Trash2 size={20} className="text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Listing
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{listingToDelete?.title || 'this listing'}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={cancelDelete}
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

export default ListingsPage;