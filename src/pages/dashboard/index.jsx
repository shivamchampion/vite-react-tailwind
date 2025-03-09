import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Search, 
  BarChart2,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useListing } from '../../contexts/ListingContext'; // FIXED: Changed from useEntity to useListing
import { APP_ROUTES, LISTING_TYPES } from '../../utils/constants';

/**
 * Dashboard Home Page Component
 * Displays dashboard overview and stats
 */
function DashboardPage() {
  const { currentUser, userProfile } = useAuth();
  const { 
    userListings, // FIXED: Changed from userEntities
    getListingCountByType, // FIXED: Changed from getEntityCountByType
    getAnalyticsData,
    loading 
  } = useListing(); // FIXED: Changed from useEntity
  
  const [analyticsData, setAnalyticsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Load analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalyticsData('30d', 'all');
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [getAnalyticsData]);
  
  // Summary boxes data
  const summaryBoxes = [
    {
      title: 'Total Listings', // FIXED: Changed from Entities
      value: Array.isArray(userListings) ? userListings.length : 0, // FIXED: Changed from userEntities
      icon: <Building className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100 text-blue-800',
      link: APP_ROUTES.DASHBOARD.LISTINGS, // FIXED: Changed from ENTITIES
      linkText: 'View all'
    },
    {
      title: 'Businesses',
      value: getListingCountByType(LISTING_TYPES.BUSINESS), // FIXED: Changed from getEntityCountByType
      icon: <Building className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100 text-purple-800',
      link: `${APP_ROUTES.DASHBOARD.LISTINGS}?type=${LISTING_TYPES.BUSINESS}`, // FIXED: Changed from ENTITIES
      linkText: 'View businesses'
    },
    {
      title: 'Franchises',
      value: getListingCountByType(LISTING_TYPES.FRANCHISE), // FIXED: Changed from getEntityCountByType
      icon: <Briefcase className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100 text-green-800',
      link: `${APP_ROUTES.DASHBOARD.LISTINGS}?type=${LISTING_TYPES.FRANCHISE}`, // FIXED: Changed from ENTITIES
      linkText: 'View franchises'
    },
    {
      title: 'Startups',
      value: getListingCountByType(LISTING_TYPES.STARTUP), // FIXED: Changed from getEntityCountByType
      icon: <TrendingUp className="w-6 h-6 text-red-600" />,
      color: 'bg-red-100 text-red-800',
      link: `${APP_ROUTES.DASHBOARD.LISTINGS}?type=${LISTING_TYPES.STARTUP}`, // FIXED: Changed from ENTITIES
      linkText: 'View startups'
    }
  ];
  
  // Quick actions
  const quickActions = [
    {
      title: 'Add New Listing', // FIXED: Changed from Entity
      description: 'Create a new business, franchise, or startup listing',
      icon: <Building className="w-8 h-8 text-indigo-600" />,
      link: APP_ROUTES.DASHBOARD.ADD_LISTING, // FIXED: Changed from ADD_ENTITY
      color: 'bg-indigo-50 hover:bg-indigo-100'
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics for your listings',
      icon: <BarChart2 className="w-8 h-8 text-blue-600" />,
      link: APP_ROUTES.DASHBOARD.ANALYTICS,
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: 'Check Messages',
      description: 'View and respond to inquiries',
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      link: APP_ROUTES.DASHBOARD.MESSAGES,
      color: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: 'Update Profile',
      description: 'Keep your profile information up to date',
      icon: <Users className="w-8 h-8 text-purple-600" />,
      link: APP_ROUTES.DASHBOARD.PROFILE,
      color: 'bg-purple-50 hover:bg-purple-100'
    }
  ];
  
  // Dashboard sections
  const dashboardSections = [
    {
      title: 'Favorites',
      icon: <Heart className="w-5 h-5 text-red-500" />,
      link: APP_ROUTES.DASHBOARD.FAVORITES,
      description: 'View and manage your saved listings'
    },
    {
      title: 'Recently Viewed',
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      link: APP_ROUTES.DASHBOARD.RECENTLY_VIEWED,
      description: 'Browse your recently viewed listings'
    },
    {
      title: 'Saved Searches',
      icon: <Search className="w-5 h-5 text-purple-500" />,
      link: APP_ROUTES.DASHBOARD.SAVED_SEARCHES,
      description: 'Access your saved search queries'
    },
    {
      title: 'Analytics',
      icon: <BarChart2 className="w-5 h-5 text-green-500" />,
      link: APP_ROUTES.DASHBOARD.ANALYTICS,
      description: 'Monitor performance metrics for your listings'
    }
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {userProfile?.displayName || currentUser?.email}
        </p>
      </header>
      
      {/* Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryBoxes.map((box, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${box.color}`}>
                {box.icon}
              </div>
              <span className="text-2xl font-bold">{box.value}</span>
            </div>
            <p className="text-gray-500 font-medium mb-3">{box.title}</p>
            <Link 
              to={box.link}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
            >
              {box.linkText}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        ))}
      </div>
      
      {/* Analytics Overview */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
            <Link 
              to={APP_ROUTES.DASHBOARD.ANALYTICS}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
            >
              View detailed analytics
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
        
        {statsLoading || !analyticsData ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
            <p className="text-gray-500">Loading analytics data...</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 mb-1">Views</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-gray-900">{analyticsData.summary.views.total}</p>
                  <div className={`text-sm flex items-center ${
                    analyticsData.summary.views.trend > 0 
                      ? 'text-green-600' 
                      : analyticsData.summary.views.trend < 0
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {analyticsData.summary.views.trend > 0 ? '+' : ''}
                    {analyticsData.summary.views.trend}%
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 mb-1">Contacts</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-gray-900">{analyticsData.summary.contacts.total}</p>
                  <div className={`text-sm flex items-center ${
                    analyticsData.summary.contacts.trend > 0 
                      ? 'text-green-600' 
                      : analyticsData.summary.contacts.trend < 0
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {analyticsData.summary.contacts.trend > 0 ? '+' : ''}
                    {analyticsData.summary.contacts.trend}%
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 mb-1">Favorites</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-gray-900">{analyticsData.summary.favorites.total}</p>
                  <div className={`text-sm flex items-center ${
                    analyticsData.summary.favorites.trend > 0 
                      ? 'text-green-600' 
                      : analyticsData.summary.favorites.trend < 0
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {analyticsData.summary.favorites.trend > 0 ? '+' : ''}
                    {analyticsData.summary.favorites.trend}%
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-gray-900">{analyticsData.summary.conversionRate.value}%</p>
                  <div className={`text-sm flex items-center ${
                    analyticsData.summary.conversionRate.trend > 0 
                      ? 'text-green-600' 
                      : analyticsData.summary.conversionRate.trend < 0
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    {analyticsData.summary.conversionRate.trend > 0 ? '+' : ''}
                    {analyticsData.summary.conversionRate.trend}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link 
              key={index}
              to={action.link}
              className={`block p-6 rounded-lg ${action.color} transition-all duration-300 hover:shadow-md`}
            >
              <div className="flex items-center mb-2">
                {action.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Dashboard Sections */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard Sections</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
          {dashboardSections.map((section, index) => (
            <Link 
              key={index}
              to={section.link}
              className="p-6 hover:bg-gray-50 transition-colors duration-300 flex flex-col"
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                  {section.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{section.description}</p>
              <div className="mt-auto flex items-center text-sm text-indigo-600 font-medium">
                View section <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;