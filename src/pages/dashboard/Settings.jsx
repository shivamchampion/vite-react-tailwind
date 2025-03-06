import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Save, Lock, Bell, Shield, CreditCard, User, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * SettingsPage Component
 * Page for managing user settings and preferences
 */
function SettingsPage() {
  const { userProfile, updateProfile, resetPassword, loading, error } = useAuth();
  
  // State for different settings tabs
  const [activeTab, setActiveTab] = useState('profile');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [emailPreferences, setEmailPreferences] = useState({
    messaging: true,
    entities: true,
    updates: false,
    marketing: false
  });
  
  const [securityFormData, setSecurityFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSuccess('');
  };
  
  // Handle email preferences change
  const handleEmailPrefChange = (e) => {
    const { name, checked } = e.target;
    setEmailPreferences(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle security form change
  const handleSecurityFormChange = (e) => {
    const { name, value } = e.target;
    setSecurityFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (securityFormData.newPassword !== securityFormData.confirmPassword) {
      setSuccess('Passwords do not match');
      return;
    }
    
    try {
      // This would call the API to change password
      // await resetPassword(securityFormData.currentPassword, securityFormData.newPassword);
      
      setSuccess('password');
      setSecurityFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Error changing password:', err);
    }
  };
  
  // Handle notification preferences save
  const handleSaveNotifications = () => {
    setSuccess('notifications');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };
  
  // Handle delete account
  const handleDeleteAccount = () => {
    // This would open a confirmation modal in a real app
    alert('Delete account functionality would be implemented here');
  };
  
  // Tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <div className="mb-8 max-w-2xl">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold mr-4">
                  {userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Change Photo
                </button>
              </div>
            </div>
            
            <form className="max-w-2xl">
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    defaultValue={userProfile?.displayName || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={userProfile?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    defaultValue={userProfile?.phoneNumber || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        );
        
      case 'security':
        return (
          <div>
            <div className="max-w-2xl">
              <h3 className="text-lg font-medium mb-4">Change Password</h3>
              
              {success === 'password' && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md flex items-start">
                  <CheckCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>Password updated successfully!</span>
                </div>
              )}
              
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={securityFormData.currentPassword}
                      onChange={handleSecurityFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={securityFormData.newPassword}
                      onChange={handleSecurityFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={securityFormData.confirmPassword}
                      onChange={handleSecurityFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Update Password
                </button>
              </form>
            </div>
            
            <div className="mt-12 pt-12 border-t max-w-2xl">
              <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
              <p className="text-gray-600 mb-4">
                Once you delete your account, all your data will be permanently removed. This action cannot be undone.
              </p>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete Account
              </button>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div>
            <div className="max-w-2xl">
              <h3 className="text-lg font-medium mb-4">Email Preferences</h3>
              
              {success === 'notifications' && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md flex items-start">
                  <CheckCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>Notification preferences updated successfully!</span>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="messaging"
                      name="messaging"
                      type="checkbox"
                      checked={emailPreferences.messaging}
                      onChange={handleEmailPrefChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="messaging" className="font-medium text-gray-700">
                      Messaging notifications
                    </label>
                    <p className="text-gray-500 text-sm">
                      Get notified when you receive a message or a response to your message
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="entities"
                      name="entities"
                      type="checkbox"
                      checked={emailPreferences.entities}
                      onChange={handleEmailPrefChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="entities" className="font-medium text-gray-700">
                      Entity updates
                    </label>
                    <p className="text-gray-500 text-sm">
                      Get notified about views, connects, and interactions with your entities
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="updates"
                      name="updates"
                      type="checkbox"
                      checked={emailPreferences.updates}
                      onChange={handleEmailPrefChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="updates" className="font-medium text-gray-700">
                      Platform updates
                    </label>
                    <p className="text-gray-500 text-sm">
                      Get notified about new features, improvements, and important updates
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="marketing"
                      name="marketing"
                      type="checkbox"
                      checked={emailPreferences.marketing}
                      onChange={handleEmailPrefChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="marketing" className="font-medium text-gray-700">
                      Marketing emails
                    </label>
                    <p className="text-gray-500 text-sm">
                      Receive marketing emails about offers, promotions, and related services
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleSaveNotifications}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        );
        
      case 'billing':
        return (
          <div>
            <div className="max-w-2xl">
              <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-500 text-sm">
                  You don't have any payment methods saved yet.
                </p>
              </div>
              
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Add Payment Method
              </button>
            </div>
            
            <div className="mt-12 max-w-2xl">
              <h3 className="text-lg font-medium mb-4">Billing History</h3>
              
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        May 15, 2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Premium Plan (Monthly)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹1,999
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        April 15, 2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Premium Plan (Monthly)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹1,999
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences
        </p>
      </header>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="sm:flex sm:divide-x">
          {/* Sidebar */}
          <nav className="sm:w-64 border-b sm:border-b-0">
            <div className="px-3 py-4 sm:p-0">
              <div className="sm:hidden px-3 py-3 font-medium text-lg text-gray-800">
                Settings
              </div>
              
              <div className="space-y-1">
                <button
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabChange('profile')}
                >
                  <User size={18} className="mr-3" />
                  Profile
                </button>
                
                <button
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'security'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabChange('security')}
                >
                  <Lock size={18} className="mr-3" />
                  Security
                </button>
                
                <button
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabChange('notifications')}
                >
                  <Bell size={18} className="mr-3" />
                  Notifications
                </button>
                
                <button
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'billing'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTabChange('billing')}
                >
                  <CreditCard size={18} className="mr-3" />
                  Billing
                </button>
              </div>
            </div>
          </nav>
          
          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-start">
                <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;