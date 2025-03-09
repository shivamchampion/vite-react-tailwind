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
  Briefcase,
  Zap,
  Layers,
  Globe,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useListing } from '../../contexts/ListingContext';
import { APP_ROUTES, LISTING_TYPES } from '../../utils/constants';

function DashboardPage() {
  const { currentUser, userProfile } = useAuth();
  const { 
    userListings, 
    getListingCountByType, 
    getAnalyticsData,
    loading 
  } = useListing();
  
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
      title: 'Total Listings',
      value: Array.isArray(userListings) ? userListings.length : 0,
      icon: <Building className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-50 text-blue-800',
      link: APP_ROUTES.DASHBOARD.LISTINGS,
      linkText: 'View all'
    },
    {
      title: 'Businesses',
      value: getListingCountByType(LISTING_TYPES.BUSINESS),
      icon: <Briefcase className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-50 text-purple-800',
      link: `${APP_ROUTES.DASHBOARD.LISTINGS}?type=${LISTING_TYPES.BUSINESS}`,
      linkText: 'View businesses'
    },
    {
      title: 'Franchises',
      value: getListingCountByType(LISTING_TYPES.FRANCHISE),
      icon: <Globe className="w-6 h-6 text-green-500" />,
      color: 'bg-green-50 text-green-800',
      link: `${APP_ROUTES.DASHBOARD.LISTINGS}?type=${LISTING_TYPES.FRANCHISE}`,
      linkText: 'View franchises'
    },
    {
      title: 'Startups',
      value: getListingCountByType(LISTING_TYPES.STARTUP),
      icon: <TrendingUp className="w-6 h-6 text-red-500" />,
      color: 'bg-red-50 text-red-800',
      link: `${APP_ROUTES.DASHBOARD.LISTINGS}?type=${LISTING_TYPES.STARTUP}`,
      linkText: 'View startups'
    }
  ];
  
  // Quick actions
  const quickActions = [
    {
      title: 'Add New Listing',
      description: 'Create a new business, franchise, or startup listing',
      icon: <Building className="w-8 h-8 text-indigo-600" />,
      link: APP_ROUTES.DASHBOARD.ADD_LISTING,
      color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      gradientFrom: 'from-indigo-50',
      gradientTo: 'to-indigo-100'
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics for your listings',
      icon: <BarChart2 className="w-8 h-8 text-blue-600" />,
      link: APP_ROUTES.DASHBOARD.ANALYTICS,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      gradientFrom: 'from-blue-50',
      gradientTo: 'to-blue-100'
    },
    {
      title: 'Check Messages',
      description: 'View and respond to inquiries',
      icon: <MessageSquare className="w-8 h-8 text-green-600" />,
      link: APP_ROUTES.DASHBOARD.MESSAGES,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      gradientFrom: 'from-green-50',
      gradientTo: 'to-green-100'
    },
    {
      title: 'Update Profile',
      description: 'Keep your profile information up to date',
      icon: <Users className="w-8 h-8 text-purple-600" />,
      link: APP_ROUTES.DASHBOARD.PROFILE,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      gradientFrom: 'from-purple-50',
      gradientTo: 'to-purple-100'
    }
  ];
  
  // Dashboard sections
  const dashboardSections = [
    {
      title: 'Favorites',
      icon: <Heart className="w-5 h-5 text-red-500" />,
      link: APP_ROUTES.DASHBOARD.FAVORITES,
      description: 'View and manage your saved listings',
      color: 'bg-red-50 text-red-600'
    },
    {
      title: 'Recently Viewed',
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      link: APP_ROUTES.DASHBOARD.RECENTLY_VIEWED,
      description: 'Browse your recently viewed listings',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Saved Searches',
      icon: <Search className="w-5 h-5 text-purple-500" />,
      link: APP_ROUTES.DASHBOARD.SAVED_SEARCHES,
      description: 'Access your saved search queries',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Analytics',
      icon: <BarChart2 className="w-5 h-5 text-green-500" />,
      link: APP_ROUTES.DASHBOARD.ANALYTICS,
      description: 'Monitor performance metrics for your listings',
      color: 'bg-green-50 text-green-600'
    }
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm rounded-lg p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {userProfile?.displayName || currentUser?.email}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {userProfile?.plan || 'Basic'} Plan
          </span>
          <Link 
            to={APP_ROUTES.DASHBOARD.SETTINGS}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Manage Plan
          </Link>
        </div>
      </header>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryBoxes.map((box, index) => (
          <div 
            key={index}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${box.color} transform transition-all hover:scale-105 hover:shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${box.color}`}>
                {box.icon}
              </div>
              <span className="text-3xl font-bold">{box.value}</span>
            </div>
            <p className="text-sm font-medium mb-3">{box.title}</p>
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
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link 
              key={index}
              to={action.link}
              className={`block p-6 rounded-lg border ${action.color} transition-all duration-300 hover:shadow-md bg-gradient-to-br ${action.gradientFrom} ${action.gradientTo}`}
            >
              <div className="flex items-center mb-4">
                {action.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Analytics Overview */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
          <Link 
            to={APP_ROUTES.DASHBOARD.ANALYTICS}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
          >
            View detailed analytics
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {statsLoading || !analyticsData ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
            <p className="text-gray-500">Loading analytics data...</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { 
                  label: 'Views', 
                  value: analyticsData.summary.views.total, 
                  trend: analyticsData.summary.views.trend,
                  color: 'text-blue-600 bg-blue-50',
                  icon: <Eye className="w-6 h-6 text-blue-500" />
                },
                { 
                  label: 'Contacts', 
                  value: analyticsData.summary.contacts.total, 
                  trend: analyticsData.summary.contacts.trend,
                  color: 'text-green-600 bg-green-50',
                  icon: <MessageSquare className="w-6 h-6 text-green-500" />
                },
                { 
                  label: 'Favorites', 
                  value: analyticsData.summary.favorites.total, 
                  trend: analyticsData.summary.favorites.trend,
                  color: 'text-red-600 bg-red-50',
                  icon: <Heart className="w-6 h-6 text-red-500" />
                },
                { 
                  label: 'Conversion', 
                  value: `${analyticsData.summary.conversionRate.value}%`, 
                  trend: analyticsData.summary.conversionRate.trend,
                  color: 'text-purple-600 bg-purple-50',
                  icon: <Zap className="w-6 h-6 text-purple-500" />
                }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${stat.color} flex items-center justify-between`}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className={`text-sm flex items-center ${
                      stat.trend > 0 
                        ? 'text-green-600' 
                        : stat.trend < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}>
                      {stat.trend > 0 ? '+' : ''}
                      {stat.trend}%
                    </div>
                  </div>
                  {stat.icon}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Dashboard Sections */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard Sections</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
          {dashboardSections.map((section, index) => (
            <Link 
              key={index}
              to={section.link}
              className="p-6 hover:bg-gray-50 transition-colors duration-300 flex flex-col group"
            >
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${section.color} group-hover:scale-110 transition-transform`}>
                  {section.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2 flex-grow">{section.description}</p>
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