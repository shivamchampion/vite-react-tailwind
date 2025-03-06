import React, { useState } from 'react';
import { 
  Lock, 
  Shield, 
  Key, 
  Activity, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import MultiFactorAuth from './MultiFactorAuth';
import PhoneVerification from './PhoneVerification';
import toast from 'react-hot-toast';

const SecuritySettings = () => {
  const { currentUser, updateProfile } = useAuth();
  
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Security sections
  const securitySections = [
    {
      id: 'overview',
      title: 'Security Overview',
      icon: <Shield className="w-6 h-6 text-blue-600" />
    },
    {
      id: 'mfa',
      title: 'Multi-Factor Authentication',
      icon: <Key className="w-6 h-6 text-green-600" />
    },
    {
      id: 'devices',
      title: 'Active Sessions',
      icon: <Activity className="w-6 h-6 text-purple-600" />
    }
  ];

  // Active sessions (simulated)
  const [activeSessions, setActiveSessions] = useState([
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      lastActive: '2 hours ago',
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'Bangalore, India',
      lastActive: '1 day ago',
      current: false
    }
  ]);

  // Terminate session
  const terminateSession = (sessionId) => {
    setLoading(true);
    try {
      // In a real app, this would call a backend API
      const updatedSessions = activeSessions.filter(
        session => session.id !== sessionId
      );
      setActiveSessions(updatedSessions);
      toast.success('Session terminated successfully');
    } catch (err) {
      toast.error('Failed to terminate session');
    } finally {
      setLoading(false);
    }
  };

  // Render active sessions
  const renderActiveSessions = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Activity className="w-6 h-6 mr-3 text-purple-600" />
        Active Sessions
      </h2>
      
      {activeSessions.map((session) => (
        <div 
          key={session.id} 
          className="flex items-center justify-between p-4 border-b last:border-b-0"
        >
          <div>
            <h3 className="font-medium">
              {session.device}
              {session.current && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Current Session
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500">
              {session.location} • Last active {session.lastActive}
            </p>
          </div>
          {!session.current && (
            <button
              onClick={() => terminateSession(session.id)}
              disabled={loading}
              className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
              Terminate
            </button>
          )}
        </div>
      ))}
    </div>
  );

  // Render security overview
  const renderSecurityOverview = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Shield className="w-6 h-6 mr-3 text-blue-600" />
        Security Overview
      </h2>
      
      <div className="space-y-4">
        {/* Account Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Lock className="w-6 h-6 mr-4 text-green-600" />
            <div>
              <h3 className="font-medium">Account Security Status</h3>
              <p className="text-sm text-gray-600">
                Your account is secured with multiple protection layers
              </p>
            </div>
          </div>
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>

        {/* Security Features */}
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { 
              title: 'Multi-Factor Authentication', 
              status: 'Recommended',
              action: () => setActiveSection('mfa')
            },
            { 
              title: 'Phone Number Verification', 
              status: 'Optional',
              action: () => {} // Add phone verification logic
            },
            { 
              title: 'Email Verification', 
              status: 'Recommended',
              action: () => {} // Add email verification logic
            },
            { 
              title: 'Login History', 
              status: 'Enabled',
              action: () => setActiveSection('devices')
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer"
              onClick={feature.action}
            >
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.status}</p>
              </div>
              <CheckCircle className={`w-5 h-5 ${
                feature.status === 'Recommended' 
                  ? 'text-yellow-500' 
                  : 'text-green-500'
              }`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderSecurityOverview();
      case 'mfa':
        return <MultiFactorAuth />;
      case 'devices':
        return renderActiveSessions();
      default:
        return renderSecurityOverview();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <Lock className="w-6 h-6 mr-3 text-indigo-600" />
            Security Center
          </h2>
          <div className="space-y-2">
            {securitySections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {section.icon}
                <span className="ml-3">{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Section Content */}
        <div className="md:col-span-3">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;