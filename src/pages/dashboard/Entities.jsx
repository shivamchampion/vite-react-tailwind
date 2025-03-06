import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Briefcase,
  TrendingUp,
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
  MoreHorizontal 
} from 'lucide-react';
import { useEntity } from '../../contexts/EntityContext';
import { APP_ROUTES, ENTITY_TYPES, PLAN_TYPES } from '../../utils/constants';

/**
 * EntitiesPage Component
 * Displays and manages user's entities
 */
function EntitiesPage() {
  const { userEntities, loading, deleteEntity } = useEntity();
  
  // Entity filtering and sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeEntity, setActiveEntity] = useState(null);
  
  // Handle delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);
  
  // Get the appropriate icon for entity type
  const getEntityIcon = (type) => {
    switch (type) {
      case ENTITY_TYPES.BUSINESS:
        return <Building size={20} />;
      case ENTITY_TYPES.FRANCHISE:
        return <Briefcase size={20} />;
      case ENTITY_TYPES.STARTUP:
        return <TrendingUp size={20} />;
      case ENTITY_TYPES.INVESTOR:
        return <Users size={20} />;
      case ENTITY_TYPES.DIGITAL_ASSET:
        return <Monitor size={20} />;
      default:
        return <Building size={20} />;
    }
  };
  
  // Filter and sort entities
  const filteredEntities = userEntities
    ? userEntities
        .filter(entity => {
          // Filter by search term
          const matchesSearch = entity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               entity.description?.toLowerCase().includes(searchTerm.toLowerCase());
          
          // Filter by type
          const matchesType = filterType === 'all' || entity.type === filterType;
          
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
  
  // Handle delete entity
  const handleDeleteClick = (entity) => {
    setEntityToDelete(entity);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (entityToDelete) {
      try {
        await deleteEntity(entityToDelete.id);
        setShowDeleteConfirm(false);
        setEntityToDelete(null);
      } catch (error) {
        console.error('Error deleting entity:', error);
      }
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setEntityToDelete(null);
  };
  
  // Entity type names for display
  const entityTypeNames = {
    [ENTITY_TYPES.BUSINESS]: 'Business',
    [ENTITY_TYPES.FRANCHISE]: 'Franchise',
    [ENTITY_TYPES.STARTUP]: 'Startup',
    [ENTITY_TYPES.INVESTOR]: 'Investor',
    [ENTITY_TYPES.DIGITAL_ASSET]: 'Digital Asset'
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
          <h1 className="text-2xl font-bold text-gray-900">My Entities</h1>
          <p className="text-gray-600 mt-1">
            Manage all your listings in one place
          </p>
        </div>
        
        <Link
          to={APP_ROUTES.DASHBOARD.ADD_ENTITY}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle size={16} className="mr-2" />
          Add New Entity
        </Link>
      </header>
      
      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg mb-8">
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
              placeholder="Search entities..."
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Types</option>
                <option value={ENTITY_TYPES.BUSINESS}>Business</option>
                <option value={ENTITY_TYPES.FRANCHISE}>Franchise</option>
                <option value={ENTITY_TYPES.STARTUP}>Startup</option>
                <option value={ENTITY_TYPES.INVESTOR}>Investor</option>
                <option value={ENTITY_TYPES.DIGITAL_ASSET}>Digital Asset</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ArrowDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Entities Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-500">Loading your entities...</p>
          </div>
        ) : filteredEntities.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Building size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No entities found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all'
                ? 'Try changing your search or filter settings'
                : 'You have not created any entities yet'}
            </p>
            {!searchTerm && filterType === 'all' && (
              <Link
                to={APP_ROUTES.DASHBOARD.ADD_ENTITY}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle size={16} className="mr-2" />
                Add Your First Entity
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('views')}
                  >
                    <div className="flex items-center">
                      <span>Views</span>
                      {sortBy === 'views' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('createdAt')}
                  >
                    <div className="flex items-center">
                      <span>Created</span>
                      {sortBy === 'createdAt' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntities.map((entity, index) => (
                  <tr key={entity.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-500">
                          {getEntityIcon(entity.type || ENTITY_TYPES.BUSINESS)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{entity.title || `Entity #${index + 1}`}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{entity.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entityTypeNames[entity.type] || 'Business'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${planStyles[entity.plan] || planStyles[PLAN_TYPES.BASIC]}`}>
                        {entity.plan?.charAt(0).toUpperCase() + entity.plan?.slice(1) || 'Basic'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entity.views || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entity.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        entity.status === 'active' ? 'bg-green-100 text-green-800' : 
                        entity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {entity.status?.charAt(0).toUpperCase() + entity.status?.slice(1) || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setActiveEntity(activeEntity === entity.id ? null : entity.id)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        
                        {activeEntity === entity.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                            <div className="py-1">
                              <Link
                                to={`${APP_ROUTES.MARKETPLACE.DETAIL}/${entity.id}`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye size={16} className="mr-2" />
                                View Listing
                              </Link>
                              <Link
                                to={`${APP_ROUTES.DASHBOARD.EDIT_ENTITY}/${entity.id}`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit2 size={16} className="mr-2" />
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(entity)}
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <Trash2 size={16} className="mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                      Delete Entity
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete "{entityToDelete?.title || 'this entity'}"? This action cannot be undone.
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

export default EntitiesPage;