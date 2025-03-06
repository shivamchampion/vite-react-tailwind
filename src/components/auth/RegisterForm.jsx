import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Check, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  GoogleIcon, 
  FacebookIcon, 
  LinkedInIcon,
  WhatsAppIcon,
  PhoneIcon  
} from '../icons/SocialIcons';

/**
 * RegisterForm Component
 * Form for user registration with various authentication methods
 */
function RegisterForm({ onClose, switchTab }) {
  const { register, loginGoogle, loginFacebook, loginLinkedIn, sendOtp, sendWhatsAppOtp, error, clearError } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registerMethod, setRegisterMethod] = useState('email'); // 'email', 'phone', 'whatsapp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '' };
    
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];
    
    return {
      score,
      label: labels[score],
      color: colors[score]
    };
  };
  
  const passwordStrength = getPasswordStrength(password);
  
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
      if (registerMethod === 'email') {
        // Email/password registration
        if (!name || !email || !password) {
          throw new Error('Please fill in all fields');
        }
        
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (passwordStrength.score < 3) {
          throw new Error('Please use a stronger password');
        }
        
        // In development mode, simulate registration
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: Simulating registration with', { name, email });
          
          // Simulate successful registration
          await new Promise(resolve => setTimeout(resolve, 800));
          setSuccessMessage('Registration successful!');
          
          // Wait before proceeding
          setTimeout(() => {
            console.log('Registration successful, automatically proceeding to login');
          }, 1500);
          
          return;
        }
        
        // Actual registration
        await register(email, password, name);
        setSuccessMessage('Registration successful!');
      } else if (registerMethod === 'phone' && otpSent) {
        // Phone OTP verification
        if (!otp) {
          throw new Error('Please enter the OTP sent to your phone');
        }
        
        if (!name) {
          throw new Error('Please enter your name');
        }
        
        // OTP verification would go here
        // await verifyOtp(otp);
        console.log('Phone verification with OTP:', otp);
        
        setSuccessMessage('Phone verification successful!');
      } else if (registerMethod === 'whatsapp' && otpSent) {
        // WhatsApp OTP verification
        if (!otp) {
          throw new Error('Please enter the OTP sent to your WhatsApp');
        }
        
        if (!name) {
          throw new Error('Please enter your name');
        }
        
        // WhatsApp OTP verification would go here
        // await verifyWhatsAppOtp(phoneNumber, otp);
        console.log('WhatsApp verification with OTP:', otp);
        
        setSuccessMessage('WhatsApp verification successful!');
      }
      
      // Auth provider will handle the state update
      // No need to manually close or reload
    } catch (err) {
      console.error('Registration error:', err);
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
      
      if (registerMethod === 'phone') {
        // Send OTP to phone
        // await sendOtp(formattedNumber);
        console.log(`Sending OTP to ${formattedNumber} via SMS`);
      } else if (registerMethod === 'whatsapp') {
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
      // In development mode, simulate social login
      if (process.env.NODE_ENV === 'development') {
        console.log(`Development mode: Simulating ${provider} login for registration`);
        
        // Simulate successful social login
        await new Promise(resolve => setTimeout(resolve, 800));
        setSuccessMessage(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful!`);
        
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
      
      // Auth provider will handle the state update
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
      
      {/* Registration Method Selector */}
      <div className="flex mb-6 border rounded-lg overflow-hidden">
        <button
          type="button"
          className={`flex-1 py-2 text-center text-sm font-medium ${
            registerMethod === 'email'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => {
            setRegisterMethod('email');
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
            registerMethod === 'phone'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => {
            setRegisterMethod('phone');
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
            registerMethod === 'whatsapp'
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => {
            setRegisterMethod('whatsapp');
            setOtpSent(false);
            clearError();
            setFormError('');
          }}
        >
          WhatsApp
        </button>
      </div>
      
      {/* Registration Form */}
      <form onSubmit={registerMethod === 'email' ? handleSubmit : otpSent ? handleSubmit : handleSendOtp}>
        {/* Name Field - Required for all methods */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
              required
            />
          </div>
        </div>
        
        {registerMethod === 'email' ? (
          <>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="register-email"
                  name="email"
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
            <div className="mb-4">
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="register-password"
                  name="password"
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
              
              {/* Password strength meter */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="h-2 bg-gray-200 rounded-full w-full mr-2">
                      <div className={`h-2 rounded-full ${passwordStrength.color}`} style={{ width: `${passwordStrength.score * 20}%` }}></div>
                    </div>
                    <span className="text-xs font-medium">{passwordStrength.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-xs text-gray-500">
                    <div className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
                      {/[A-Z]/.test(password) ? <Check size={12} className="mr-1" /> : <span className="w-3 mr-1" />}
                      Uppercase
                    </div>
                    <div className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : ''}`}>
                      {/[a-z]/.test(password) ? <Check size={12} className="mr-1" /> : <span className="w-3 mr-1" />}
                      Lowercase
                    </div>
                    <div className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-600' : ''}`}>
                      {/[0-9]/.test(password) ? <Check size={12} className="mr-1" /> : <span className="w-3 mr-1" />}
                      Number
                    </div>
                    <div className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}`}>
                      {/[^A-Za-z0-9]/.test(password) ? <Check size={12} className="mr-1" /> : <span className="w-3 mr-1" />}
                      Special
                    </div>
                    <div className={`flex items-center ${password.length >= 8 ? 'text-green-600' : ''}`}>
                      {password.length >= 8 ? <Check size={12} className="mr-1" /> : <span className="w-3 mr-1" />}
                      8+ Chars
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div className="mb-4">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Phone Number Field for OTP methods */}
            <div className="mb-4">
              <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="text-gray-400" />
                </div>
                <div className="flex items-center">
                  <span className="absolute left-10 text-gray-500">+91</span>
                  <input
                    id="register-phone"
                    name="phoneNumber"
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
              <div className="mb-4">
                <label htmlFor="register-otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  id="register-otp"
                  name="otp"
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
        
        {/* Terms & Conditions */}
        <div className="mb-6">
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
              I agree to the{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
              >
                Privacy Policy
              </button>
            </label>
          </div>
        </div>
        
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
            : registerMethod === 'email'
            ? 'Create Account'
            : otpSent
            ? 'Verify OTP'
            : `Send OTP via ${registerMethod === 'phone' ? 'SMS' : 'WhatsApp'}`}
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
      
      {/* Switch to Login */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={switchTab}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;