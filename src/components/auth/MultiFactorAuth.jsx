import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Smartphone, 
  Check, 
  AlertCircle, 
  QrCode 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const MultiFactorAuth = () => {
  const { currentUser, userProfile } = useAuth();
  
  const [mfaMethod, setMfaMethod] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulated MFA setup methods
  const setupMFAMethods = {
    authenticator: {
      name: 'Authenticator App',
      icon: <QrCode className="w-6 h-6 text-blue-600" />,
      description: 'Use Google Authenticator or similar app'
    },
    sms: {
      name: 'SMS',
      icon: <Smartphone className="w-6 h-6 text-green-600" />,
      description: 'Receive 2FA code via SMS'
    }
  };

  // Check MFA status on component mount
  useEffect(() => {
    // In a real app, check user's MFA status from backend/Firebase
    const checkMFAStatus = async () => {
      try {
        // Simulated MFA check
        const mfaStatus = userProfile?.mfaEnabled || false;
        setMfaEnabled(mfaStatus);
      } catch (err) {
        console.error('MFA status check failed', err);
      }
    };

    checkMFAStatus();
  }, [userProfile]);

  // Generate recovery codes
  const generateRecoveryCodes = () => {
    // Generate 8 random recovery codes
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
    
    setRecoveryCode(codes.join('\n'));
    toast.success('Recovery codes generated');
  };

  // Enable MFA
  const enableMFA = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate MFA method selection
      if (!mfaMethod) {
        throw new Error('Please select an MFA method');
      }

      // Simulated MFA setup 
      const mfaSetup = {
        method: mfaMethod,
        enabled: true,
        recoveryCodesGenerated: new Date().toISOString()
      };

      // In a real app, this would interact with Firebase or backend
      await updateUserMFASettings(mfaSetup);

      setMfaEnabled(true);
      generateRecoveryCodes();
      toast.success('Multi-Factor Authentication enabled');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Disable MFA
  const disableMFA = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulated MFA disable
      await updateUserMFASettings({
        method: null,
        enabled: false,
        recoveryCodesGenerated: null
      });

      setMfaEnabled(false);
      setMfaMethod('');
      setRecoveryCode('');
      toast.success('Multi-Factor Authentication disabled');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simulated backend update (would be a real API call)
  const updateUserMFASettings = async (mfaSettings) => {
    // Simulate API call
    console.log('Updating MFA Settings:', mfaSettings);
    // In a real app, this would call your backend or Firebase
  };

  // Copy recovery codes
  const copyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCode);
    toast.success('Recovery codes copied');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Shield className="w-8 h-8 text-indigo-600 mr-4" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Multi-Factor Authentication
          </h2>
          <p className="text-gray-600">
            Add an extra layer of security to your account
          </p>
        </div>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center mb-4">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* MFA Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
        <div className="flex items-center">
          <Lock className={`w-6 h-6 mr-3 ${mfaEnabled ? 'text-green-600' : 'text-gray-400'}`} />
          <div>
            <h3 className="font-medium text-gray-900">
              {mfaEnabled ? 'Multi-Factor Authentication Enabled' : 'Multi-Factor Authentication Disabled'}
            </h3>
            <p className="text-sm text-gray-600">
              {mfaEnabled 
                ? 'Your account has an extra layer of security' 
                : 'Enhance your account security'}
            </p>
          </div>
        </div>
        {mfaEnabled ? (
          <button
            onClick={disableMFA}
            disabled={loading}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
          >
            Disable
          </button>
        ) : (
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Get Started
          </button>
        )}
      </div>

      {/* MFA Method Selection */}
      {!mfaEnabled && (
        <div>
          <h3 className="text-lg font-medium mb-4">Choose MFA Method</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(setupMFAMethods).map(([key, method]) => (
              <button
                key={key}
                onClick={() => setMfaMethod(key)}
                className={`p-4 border rounded-lg text-left transition-all ${
                  mfaMethod === key 
                    ? 'border-indigo-600 bg-indigo-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center mb-2">
                  {method.icon}
                  <span className="ml-3 font-medium">{method.name}</span>
                </div>
                <p className="text-sm text-gray-600">{method.description}</p>
              </button>
            ))}
          </div>

          {mfaMethod && (
            <button
              onClick={enableMFA}
              disabled={loading}
              className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {loading ? 'Setting Up...' : 'Enable Multi-Factor Authentication'}
            </button>
          )}
        </div>
      )}

      {/* Recovery Codes */}
      {mfaEnabled && recoveryCode && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">
            Recovery Codes
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            Store these codes safely. They can be used to regain account access if you lose your 2FA device.
          </p>
          <pre className="bg-yellow-100 p-3 rounded-md text-yellow-900 mb-3">
            {recoveryCode}
          </pre>
          <div className="flex space-x-3">
            <button
              onClick={copyRecoveryCodes}
              className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
            >
              Copy Codes
            </button>
            <button
              onClick={generateRecoveryCodes}
              className="px-4 py-2 border border-yellow-300 text-yellow-800 rounded-md hover:bg-yellow-100"
            >
              Regenerate Codes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiFactorAuth;