import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { APP_ROUTES } from '../../utils/constants';
import { 
  GoogleIcon, 
  FacebookIcon, 
  LinkedInIcon, 
  WhatsAppIcon,
  PhoneIcon 
} from '../icons/SocialIcons';

/**
 * LoginForm Component
 * Form for user login with various authentication methods
 */
function LoginForm({ onClose, switchTab }) {
  const { login, loginGoogle, loginFacebook, loginLinkedIn, sendOtp, sendWhatsAppOtp, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'phone', 'whatsapp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setFormError('');
    setLoading(true);
    
    try {
      if (loginMethod === 'email') {
        // Email/password login
        if (!email || !password) {
          throw new Error('Please enter both email and password');
        }
        
        await login(email, password);
        onClose();
        navigate(APP_ROUTES.DASHBOARD.ROOT);
      } else if (loginMethod === 'phone' && otpSent) {
        // Phone OTP verification
        if (!otp) {
          throw new Error('Please enter the OTP sent to your phone');
        }
        
        // OTP verification would go here
        // await verifyOtp(otp);
        // onClose();
        // navigate(APP_ROUTES.DASHBOARD.ROOT);
        
        // For now, just show an alert
        alert('Phone OTP verification is not yet implemented');
      } else if (loginMethod === 'whatsapp' && otpSent) {
        // WhatsApp OTP verification
        if (!otp) {
          throw new Error('Please enter the OTP sent to your WhatsApp');
        }
        
        // WhatsApp OTP verification would go here
        // await verifyWhatsAppOtp(phoneNumber, otp);
        // onClose();
        // navigate(APP_ROUTES.DASHBOARD.ROOT);
        
        // For now, just show an alert
        alert('WhatsApp OTP verification is not yet implemented');
      }
    } catch (err) {
      console.error('Login error:', err);
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Send OTP to phone or WhatsApp
  const handleSendOtp = async (e) => {
    e.preventDefault();
    clearError();
    setFormError('');
    setLoading(true);
    
    try {
      if (!phoneNumber) {
        throw new Error('Please enter your phone number');
      }
      
      if (loginMethod === 'phone') {
        // Send OTP to phone
        // This would normally use a recaptcha container ID
        // await sendOtp(phoneNumber, 'recaptcha-container');
        
        // For now, just show an alert
        alert(`OTP would be sent to ${phoneNumber} via SMS`);
      } else if (loginMethod === 'whatsapp') {
        // Send OTP to WhatsApp
        // await sendWhatsAppOtp(phoneNumber);
        
        // For now, just show an alert
        alert(`OTP would be sent to ${phoneNumber} via WhatsApp`);
      }
      
      setOtpSent(true);
    } catch (err) {
      console.error('Send OTP error:', err);
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle social login
  const handleSocialLogin = async (provider) => {
    clearError();
    setFormError('');
    setLoading(true);
    
    try {
      switch (provider) {
        case 'google':
          await loginGoogle();
          break;
        case 'facebook':
          await loginFacebook();
          break;
        case 'linkedin':
          // This is just a placeholder, actual LinkedIn login requires more setup
          await loginLinkedIn();
          break;
        default:
          throw new Error('Invalid login provider');
      }
      
      onClose();
      navigate(APP_ROUTES.DASHBOARD.ROOT);
    } catch (err) {
      console.error(`${provider} login error:`, err);
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
      
      {/* Login Method Selector */}
      <div className="flex mb-6 border rounded-md">
        <button
          type="button"
          className={`flex-1 py-2 text-center text-sm ${
            loginMethod === 'email'
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
          onClick={() => {
            setLoginMethod('email');
            setOtpSent(false);
          }}
        >
          Email
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-center text-sm ${
            loginMethod === 'phone'
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
          onClick={() => {
            setLoginMethod('phone');
            setOtpSent(false);
          }}
        >
          Phone
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-center text-sm ${
            loginMethod === 'whatsapp'
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
          onClick={() => {
            setLoginMethod('whatsapp');
            setOtpSent(false);
          }}
        >
          WhatsApp
        </button>
      </div>
      
      {/* Error Message */}
      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-4 flex items-start">
          <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{formError || error}</span>
        </div>
      )}
      
      {/* Login Form */}
      <form onSubmit={loginMethod === 'email' ? handleSubmit : otpSent ? handleSubmit : handleSendOtp}>
        {loginMethod === 'email' ? (
          <>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => alert('Forgot password functionality would be implemented here')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-400" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Phone Number Field for OTP methods */}
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="text-gray-400" />
                </div>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+91 98765 43210"
                  disabled={otpSent}
                  required
                />
              </div>
              {otpSent && (
                <p className="text-xs text-gray-500 mt-1">
                  OTP sent to {phoneNumber}. 
                  <button 
                    type="button" 
                    className="text-blue-600 ml-1"
                    onClick={() => setOtpSent(false)}
                  >
                    Change
                  </button>
                </p>
              )}
            </div>
            
            {/* OTP Field (shown after OTP is sent) */}
            {otpSent && (
              <div className="mb-6">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter OTP"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Didn't receive the code? 
                  <button 
                    type="button" 
                    className="text-blue-600 ml-1"
                    onClick={handleSendOtp}
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}
          </>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading
            ? 'Please wait...'
            : loginMethod === 'email'
            ? 'Log In'
            : otpSent
            ? 'Verify OTP'
            : `Send OTP via ${loginMethod === 'phone' ? 'SMS' : 'WhatsApp'}`}
        </button>
      </form>
      
      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">or continue with</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      
      {/* Social Login Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          type="button"
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
        >
          <GoogleIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => handleSocialLogin('facebook')}
          disabled={loading}
        >
          <FacebookIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => handleSocialLogin('linkedin')}
          disabled={loading}
        >
          <LinkedInIcon className="w-5 h-5" />
        </button>
      </div>
      
      {/* Switch to Register */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={switchTab}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}

export default LoginForm;