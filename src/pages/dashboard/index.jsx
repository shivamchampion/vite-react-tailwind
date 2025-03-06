import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  TrendingUp, 
  Users, 
  Calendar, 
  MessageSquare, 
  PlusCircle, 
  ArrowRight,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEntity } from '../../contexts/EntityContext';
import { APP_ROUTES } from '../../utils/constants';

/**
 * Dashboard Component
 * Main dashboard page for authenticated users
 */
function Dashboard() {
  const { userProfile } = useAuth();
  const { userEntities = [], loading } = useEntity();
  
  // Safely get user display name with fallback
  const displayName = userProfile?.displayName || 'User';
  
  // Safely get connects balance with fallback
  const connectsBalance = userProfile?.connectsBalance || 0;
  
  // Stats for display (placeholder data)
  const stats = [
    {
      name: 'Total Entities',
      value: Array.isArray(userEntities) ? userEntities.length : 0,
      icon: <Building size={20} className="text-blue-500" />,
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Active Connects',
      value: connectsBalance,
      icon: <Users size={20} className="text-green-500" />,
      change: '-3',
      changeType: 'decrease'
    },
    {
      name: 'Profile Views',
      value: '126',
      icon: <Eye size={20} className="text-purple-500" />,
      change: '+18%',
      changeType: 'increase'
    },
    {
      name: 'Unread Messages',
      value: '5',
      icon: <MessageSquare size={20} className="text-yellow-500" />,
      change: '+2',
      changeType: 'increase'
    }
  ];
  
  // Recent activities (placeholder data)
  const recentActivities = [
    {
      id: 1,
      activity: 'New message from John regarding your business listing',
      time: '2 hours ago',
      type: 'message'
    },
    {
      id: 2,
      activity: 'Your Premium plan for "Coffee Shop" will expire in 3 days',
      time: '1 day ago',
      type: 'subscription'
    },
    {
      id: 3,
      activity: 'Your business "Coffee Shop" received 5 new views',
      time: '2 days ago',
      type: 'view'
    }
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {displayName}! Here's what's happening with your listings.
        </p>
      </header>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <div className="mt-2">
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entity List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Your Entities</h2>
              <Link 
                to={APP_ROUTES.DASHBOARD.ADD_ENTITY}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                <PlusCircle size={16} className="mr-1" />
                Add New
              </Link>
            </div>
            
            <div className="divide-y">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                  <p className="text-gray-500">Loading your entities...</p>
                </div>
              ) : Array.isArray(userEntities) && userEntities.length > 0 ? (
                userEntities.slice(0, 5).map((entity, index) => (
                  <div key={index} className="p-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                        <Building size={20} className="text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">{entity?.title || `Entity #${index + 1}`}</h3>
                        <p className="text-sm text-gray-500">
                          {entity?.type || 'Business'} • {entity?.plan || 'Basic'} Plan
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-4">
                        <Eye size={16} className="inline-block mr-1" />
                        {entity?.views || 0} views
                      </span>
                      <Link
                        to={`${APP_ROUTES.DASHBOARD.EDIT_ENTITY}/${entity?.id || index}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit <ArrowRight size={16} className="inline-block ml-1" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500 mb-4">You haven't added any entities yet.</p>
                  <Link
                    to={APP_ROUTES.DASHBOARD.ADD_ENTITY}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusCircle size={16} className="mr-2" />
                    Add Your First Entity
                  </Link>
                </div>
              )}
            </div>
            
            {Array.isArray(userEntities) && userEntities.length > 5 && (
              <div className="p-4 border-t text-center">
                <Link
                  to={APP_ROUTES.DASHBOARD.ENTITIES}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All Entities
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow h-full">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            
            <div className="divide-y">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-6">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {activity.type === 'message' ? (
                          <MessageSquare size={16} className="text-blue-600" />
                        ) : activity.type === 'subscription' ? (
                          <Calendar size={16} className="text-purple-600" />
                        ) : (
                          <Eye size={16} className="text-green-600" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{activity.activity}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t">
              <h3 className="font-medium mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to={APP_ROUTES.DASHBOARD.ADD_ENTITY}
                  className="block px-4 py-2 bg-gray-50 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  <PlusCircle size={16} className="inline-block mr-2" />
                  Add New Entity
                </Link>
                <Link
                  to={APP_ROUTES.DASHBOARD.MESSAGES}
                  className="block px-4 py-2 bg-gray-50 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  <MessageSquare size={16} className="inline-block mr-2" />
                  Check Messages
                </Link>
                <Link
                  to={APP_ROUTES.DASHBOARD.CONNECTS}
                  className="block px-4 py-2 bg-gray-50 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Users size={16} className="inline-block mr-2" />
                  Buy Connects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;