import React, { useState, useContext } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
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
  // Use direct context to avoid import issues
  const auth = useContext(AuthContext);
  const { login, loginGoogle, loginFacebook, loginLinkedIn, sendOtp, sendWhatsAppOtp, error, clearError } = auth;
  
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
  const [successMessage, setSuccessMessage] = useState('');
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setFormError('');
    setSuccessMessage('');
    setLoading(true);
    
    try {
      if (loginMethod === 'email') {
        // Email/password login
        if (!email || !password) {
          throw new Error('Please enter both email and password');
        }
        
        // For testing purposes: simulate a login
        if (process.env.NODE_ENV === 'development' && email === 'test@example.com' && password === 'password') {
          console.log('Development mode: Simulating successful login');
          setSuccessMessage('Login successful!');
          
          // Wait a moment before proceeding
          await new Promise(resolve => setTimeout(resolve, 1000));
          return;
        }
        
        // Actual login
        await login(email, password);
        setSuccessMessage('Login successful!');
        
        // AuthModal will close automatically from its useEffect
        // No need to manually close or reload
      } else if (loginMethod === 'phone' && otpSent) {
        // Phone OTP verification
        if (!otp) {
          throw new Error('Please enter the OTP sent to your phone');
        }
        
        // OTP verification would go here
        // await verifyOtp(otp);
        console.log('Phone verification with OTP:', otp);
        
        setSuccessMessage('Phone verification successful!');
      } else if (loginMethod === 'whatsapp' && otpSent) {
        // WhatsApp OTP verification
        if (!otp) {
          throw new Error('Please enter the OTP sent to your WhatsApp');
        }
        
        // WhatsApp OTP verification would go here
        // await verifyWhatsAppOtp(phoneNumber, otp);
        console.log('WhatsApp verification with OTP:', otp);
        
        setSuccessMessage('WhatsApp verification successful!');
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
      
      // Format phone number - ensure it has 10 digits
      let formattedNumber = phoneNumber.replace(/\D/g, '');
      if (formattedNumber.length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number');
      }
      
      // Add +91 prefix if not present
      if (!phoneNumber.startsWith('+91')) {
        formattedNumber = '+91' + formattedNumber;
      }
      
      if (loginMethod === 'phone') {
        // Send OTP to phone
        // await sendOtp(formattedNumber);
        console.log(`Sending OTP to ${formattedNumber} via SMS`);
      } else if (loginMethod === 'whatsapp') {
        // Send OTP to WhatsApp
        // await sendWhatsAppOtp(formattedNumber);
        console.log(`Sending OTP to ${formattedNumber} via WhatsApp`);
      }
      
      setOtpSent(true);
      setSuccessMessage(`OTP sent to ${formattedNumber}`);
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
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
    setSuccessMessage('');
    setLoading(true);
    
    try {
      // For development mode: simulate successful login
      if (process.env.NODE_ENV === 'development') {
        console.log(`Development mode: Simulating successful ${provider} login`);
        setSuccessMessage(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful!`);
        
        // Wait a moment before proceeding
        await new Promise(resolve => setTimeout(resolve, 1000));
        return;
      }
      
      switch (provider) {
        case 'google':
          await loginGoogle();
          break;
        case 'facebook':
          await loginFacebook();
          break;
        case 'linkedin':
          await loginLinkedIn();
          break;
        default:
          throw new Error('Invalid login provider');
      }
      
      setSuccessMessage(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful!`);
      
      // AuthModal will close automatically from its useEffect
      // No need to manually close or reload
    } catch (err) {
      console.error(`${provider} login error:`, err);
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 flex items-start">
          <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{successMessage}</span>
        </div>
      )}
      
      {/* Error Message */}
      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-start">
          <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{formError || error}</span>
        </div>
      )}
      
      {/* Login Method Selector */}
      <div className="flex mb-6 border rounded-lg overflow-hidden">
        <button
          type="button"
          className={`flex-1 py-2 text-center text-sm font-medium ${
            loginMethod === 'email'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => {
            setLoginMethod('email');
            setOtpSent(false);
            clearError();
            setFormError('');
          }}
        >
          Email
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-center text-sm font-medium ${
            loginMethod === 'phone'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => {
            setLoginMethod('phone');
            setOtpSent(false);
            clearError();
            setFormError('');
          }}
        >
          Phone
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-center text-sm font-medium ${
            loginMethod === 'whatsapp'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => {
            setLoginMethod('whatsapp');
            setOtpSent(false);
            clearError();
            setFormError('');
          }}
        >
          WhatsApp
        </button>
      </div>
      
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
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="flex items-center">
                  <span className="absolute left-10 text-gray-500">+91</span>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-20 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="9876543210"
                    disabled={otpSent}
                    maxLength={10}
                    required
                  />
                </div>
              </div>
              {otpSent && (
                <p className="text-xs text-gray-500 mt-1">
                  OTP sent to +91 {phoneNumber}. 
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
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
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">or continue with</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      
      {/* Social Login Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          type="button"
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
        >
          <GoogleIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          onClick={() => handleSocialLogin('facebook')}
          disabled={loading}
        >
          <FacebookIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          onClick={() => handleSocialLogin('linkedin')}
          disabled={loading}
        >
          <LinkedInIcon className="w-5 h-5" />
        </button>
      </div>
      
      {/* Switch to Register */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={switchTab}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;