import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare, 
  Heart, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  HelpCircle, 
  RefreshCw,
  ChevronDown,
  Building,
  MapPin,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useListing } from '../../contexts/ListingContext';
import { LISTING_TYPES } from '../../utils/constants';

/**
 * AnalyticsPage Component
 * Displays performance metrics and insights for user's listings
 */
function AnalyticsPage() {
  const { currentUser, userProfile } = useAuth();
  const { userListings, getAnalyticsData, loading } = useListing();
  
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30d'); // 7d, 30d, 90d, 1y
  const [selectedListing, setSelectedListing] = useState('all');
  const [loadingData, setLoadingData] = useState(true);

  // Fetch analytics data on component mount and when filters change
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoadingData(true);
      
      try {
        const data = await getAnalyticsData(dateRange, selectedListing);
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchAnalyticsData();
  }, [dateRange, selectedListing, getAnalyticsData]);

  // Format number with comma separators
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get listing options for dropdown
  const getListingOptions = () => {
    if (!userListings || userListings.length === 0) {
      return [{ id: 'all', title: 'All Listings' }];
    }
    
    const options = [{ id: 'all', title: 'All Listings' }];
    userListings.forEach((listing, index) => {
      options.push({
        id: listing.id || index.toString(),
        title: listing.title || `Listing #${index + 1}`
      });
    });
    
    return options;
  };

  // Get color class based on trend
  const getTrendColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Get trend icon based on value
  const getTrendIcon = (value) => {
    if (value > 0) return <ArrowUp size={16} className="text-green-600" />;
    if (value < 0) return <ArrowDown size={16} className="text-red-600" />;
    return null;
  };

  // Check if we have all the data to show the analytics
  const isDataLoaded = !loadingData && analyticsData && analyticsData.summary;

  return (
    <div>
      <header className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor performance and insights for your listings
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
          {/* Date Range Selector */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
          
          {/* Listing Selector */}
          <div className="relative">
            <select
              value={selectedListing}
              onChange={(e) => setSelectedListing(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {getListingOptions().map(option => (
                <option key={option.id} value={option.id}>
                  {option.title}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={() => {
              setLoadingData(true);
              // Refresh data after a short delay to show loading state
              setTimeout(() => {
                getAnalyticsData(dateRange, selectedListing)
                  .then(data => {
                    setAnalyticsData(data);
                    setLoadingData(false);
                  })
                  .catch(err => {
                    console.error('Error refreshing data:', err);
                    setError('Failed to refresh analytics data.');
                    setLoadingData(false);
                  });
              }, 500);
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw size={16} className={`mr-2 ${loadingData ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>
      
      {loadingData ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
          {error}
        </div>
      ) : analyticsData ? (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Views Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold mt-2">{formatNumber(analyticsData.summary.views.total)}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Eye size={24} className="text-blue-500" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className={`text-sm font-medium ${getTrendColor(analyticsData.summary.views.trend)}`}>
                  {analyticsData.summary.views.trend > 0 ? '+' : ''}{analyticsData.summary.views.trend}%
                </span>
                <span className="text-sm text-gray-500 ml-1">from previous period</span>
              </div>
            </div>
            
            {/* Contacts Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold mt-2">{formatNumber(analyticsData.summary.contacts.total)}</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <MessageSquare size={24} className="text-green-500" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className={`text-sm font-medium ${getTrendColor(analyticsData.summary.contacts.trend)}`}>
                  {analyticsData.summary.contacts.trend > 0 ? '+' : ''}{analyticsData.summary.contacts.trend}%
                </span>
                <span className="text-sm text-gray-500 ml-1">from previous period</span>
              </div>
            </div>
            
            {/* Favorites Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Favorites</p>
                  <p className="text-2xl font-bold mt-2">{formatNumber(analyticsData.summary.favorites.total)}</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <Heart size={24} className="text-red-500" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className={`text-sm font-medium ${getTrendColor(analyticsData.summary.favorites.trend)}`}>
                  {analyticsData.summary.favorites.trend > 0 ? '+' : ''}{analyticsData.summary.favorites.trend}%
                </span>
                <span className="text-sm text-gray-500 ml-1">from previous period</span>
              </div>
            </div>
            
            {/* Conversion Rate Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold mt-2">{analyticsData.summary.conversionRate.value}%</p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingUp size={24} className="text-purple-500" />
                </div>
              </div>
              <div className="mt-2 flex items-center">
                <span className={`text-sm font-medium ${getTrendColor(analyticsData.summary.conversionRate.trend)}`}>
                  {analyticsData.summary.conversionRate.trend > 0 ? '+' : ''}{analyticsData.summary.conversionRate.trend}%
                </span>
                <span className="text-sm text-gray-500 ml-1">from previous period</span>
              </div>
            </div>
          </div>
          
          {/* View Trends Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Performance Trends</h2>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Views</span>
                </div>
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Contacts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Favorites</span>
                </div>
              </div>
            </div>
            
            {/* This would be a real chart in production - using a placeholder for simplicity */}
            <div className="h-80 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
              <div className="text-center p-4">
                <BarChart2 size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Performance chart would display here</p>
                <p className="text-sm text-gray-400">
                  Shows daily views, contacts, and favorites over time
                </p>
              </div>
            </div>
          </div>
          
          {/* Two Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Listings */}
            <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Top Performing Listings</h2>
              
              {!analyticsData.topListings || analyticsData.topListings.length === 0 ? (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No listing data available</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {analyticsData.topListings.map((listing, index) => (
                    <div key={listing.id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                        <img 
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="ml-4 flex-grow">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{listing.title}</h3>
                            <div className="flex items-center mt-1">
                              <Building size={12} className="text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500 mr-3">
                                {listing.type === LISTING_TYPES.BUSINESS ? 'Business' : 
                                 listing.type === LISTING_TYPES.FRANCHISE ? 'Franchise' : 
                                 listing.type === LISTING_TYPES.STARTUP ? 'Startup' : 
                                 listing.type === LISTING_TYPES.INVESTOR ? 'Investor' : 
                                 'Digital Asset'}
                              </span>
                              <MapPin size={12} className="text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500 mr-3">{listing.location}</span>
                              <IndianRupee size={12} className="text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">{listing.price}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-sm font-semibold">{listing.views}</div>
                              <div className="text-xs text-gray-500">Views</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-semibold">{listing.contacts}</div>
                              <div className="text-xs text-gray-500">Contacts</div>
                            </div>
                            <div className="text-center flex flex-col items-center">
                              <div className="flex items-center">
                                <span className={`text-sm font-semibold ${getTrendColor(listing.trend)}`}>
                                  {listing.trend > 0 ? '+' : ''}{listing.trend}%
                                </span>
                                {getTrendIcon(listing.trend)}
                              </div>
                              <div className="text-xs text-gray-500">Growth</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {userListings && userListings.length > 5 && (
                <div className="mt-4 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View All Listings
                  </button>
                </div>
              )}
            </div>
            
            {/* Traffic Sources */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Traffic Sources</h2>
              
              <div className="space-y-4">
                {analyticsData.trafficSources && analyticsData.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full bg-${
                        index === 0 ? 'blue' : 
                        index === 1 ? 'green' : 
                        index === 2 ? 'purple' : 
                        index === 3 ? 'yellow' : 
                        'gray'
                      }-500 mr-2`}></div>
                      <span className="text-sm text-gray-700">{source.source}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">{source.percentage}%</span>
                      <div className={`flex items-center text-xs ${getTrendColor(source.trend)}`}>
                        {getTrendIcon(source.trend)}
                        <span className="ml-0.5">{Math.abs(source.trend)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Placeholder for pie chart */}
              <div className="mt-6 h-48 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-gray-500">Traffic sources chart would display here</p>
                </div>
              </div>
              
              {analyticsData.demographics && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Visitor Demographics</h3>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Top Locations</h4>
                    <div className="space-y-2">
                      {analyticsData.demographics.locations.slice(0, 3).map((location, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">{location.location}</span>
                          <span className="text-xs font-medium">{location.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Devices</h4>
                    <div className="flex items-center justify-between">
                      {analyticsData.demographics.devices.map((device, index) => (
                        <div key={index} className="text-center">
                          <span className="text-xs font-medium">{device.percentage}%</span>
                          <p className="text-xs text-gray-600">{device.device}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Insights and Recommendations */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Insights & Recommendations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-blue-100 rounded-lg bg-blue-50 p-4">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <TrendingUp size={16} className="text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 mb-1">Performance Insight</h3>
                    <p className="text-sm text-blue-700">
                      Your listings are getting {analyticsData.summary.views.trend > 0 ? 'more' : 'fewer'} views 
                      compared to the previous period. Keep track of this trend to understand your visibility.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border border-green-100 rounded-lg bg-green-50 p-4">
                <div className="flex items-start">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <Users size={16} className="text-green-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-green-800 mb-1">Audience Insight</h3>
                    <p className="text-sm text-green-700">
                      Most of your traffic comes from {analyticsData.demographics?.locations[0]?.location || 'your primary region'}. 
                      Consider targeting this region more specifically in your listing descriptions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border border-purple-100 rounded-lg bg-purple-50 p-4">
                <div className="flex items-start">
                  <div className="p-2 bg-purple-100 rounded-full mr-3">
                    <MessageSquare size={16} className="text-purple-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-purple-800 mb-1">Conversion Tip</h3>
                    <p className="text-sm text-purple-700">
                      Your conversion rate is {analyticsData.summary.conversionRate.value}%. 
                      Try adding more detailed information and high-quality images to your listings 
                      to improve engagement.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border border-yellow-100 rounded-lg bg-yellow-50 p-4">
                <div className="flex items-start">
                  <div className="p-2 bg-yellow-100 rounded-full mr-3">
                    <HelpCircle size={16} className="text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 mb-1">Did You Know?</h3>
                    <p className="text-sm text-yellow-700">
                      Premium plan listings receive up to 3x more views than Basic plan listings. 
                      Consider upgrading your plan to increase visibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-500 mb-4">
            <BarChart2 size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
          <p className="text-gray-500 mb-4 max-w-lg mx-auto">
            Your analytics data may be loading or you may not have any listings yet. 
            Create listings and get views to see performance analytics.
          </p>
          <button
            onClick={() => {
              setLoadingData(true);
              setTimeout(() => setLoadingData(false), 1000);
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh Analytics
          </button>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;