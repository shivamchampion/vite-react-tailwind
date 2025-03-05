import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Check } from 'lucide-react';
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
 * RegisterForm Component
 * Form for user registration with various authentication methods
 */
function RegisterForm({ onClose, switchTab }) {
  const { register, loginGoogle, loginFacebook, loginLinkedIn, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };
  
  // Check password strength
  const checkPasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setFormError('');
    
    // Validate the form
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    
    if (!acceptTerms) {
      setFormError('You must accept the terms and conditions');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(formData.email, formData.password, formData.fullName);
      onClose();
      navigate(APP_ROUTES.DASHBOARD.ROOT);
    } catch (err) {
      console.error('Registration error:', err);
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle social registration
  const handleSocialRegister = async (provider) => {
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
      console.error(`${provider} registration error:`, err);
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Password strength indicator
  const renderPasswordStrength = () => {
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return (
      <div className="mt-1">
        <div className="flex h-1 w-full space-x-1">
          {[1, 2, 3, 4].map((segment) => (
            <div
              key={segment}
              className={`h-full flex-1 rounded-full ${
                passwordStrength >= segment ? colors[passwordStrength - 1] : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>
        {formData.password && (
          <p className="mt-1 text-xs text-gray-600">
            Password strength: <span className="font-medium">{labels[passwordStrength - 1] || 'Too weak'}</span>
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
      
      {/* Error Message */}
      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-4 flex items-start">
          <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{formError || error}</span>
        </div>
      )}
      
      {/* Registration Form */}
      <form onSubmit={handleSubmit}>
        {/* Full Name Field */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
              required
            />
          </div>
        </div>
        
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
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>
        
        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              minLength={8}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => togglePasswordVisibility('password')}
            >
              {showPassword ? (
                <EyeOff size={18} className="text-gray-400" />
              ) : (
                <Eye size={18} className="text-gray-400" />
              )}
            </button>
          </div>
          {renderPasswordStrength()}
        </div>
        
        {/* Confirm Password Field */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? 'border-red-300'
                  : formData.confirmPassword
                  ? 'border-green-300'
                  : 'border-gray-300'
              }`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              {showConfirmPassword ? (
                <EyeOff size={18} className="text-gray-400" />
              ) : (
                <Eye size={18} className="text-gray-400" />
              )}
            </button>
          </div>
          {formData.confirmPassword && (
            <p className={`mt-1 text-xs ${
              formData.password !== formData.confirmPassword
                ? 'text-red-500'
                : 'text-green-500'
            }`}>
              {formData.password !== formData.confirmPassword
                ? 'Passwords do not match'
                : 'Passwords match'}
            </p>
          )}
        </div>
        
        {/* Terms and Conditions */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              I accept the{' '}
              <a href={APP_ROUTES.STATIC.TERMS} className="text-blue-600 hover:underline" target="_blank">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href={APP_ROUTES.STATIC.PRIVACY} className="text-blue-600 hover:underline" target="_blank">
                Privacy Policy
              </a>
            </span>
          </label>
        </div>
        
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
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      
      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">or sign up with</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      
      {/* Social Registration Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          type="button"
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => handleSocialRegister('google')}
          disabled={loading}
        >
          <GoogleIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => handleSocialRegister('facebook')}
          disabled={loading}
        >
          <FacebookIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => handleSocialRegister('linkedin')}
          disabled={loading}
        >
          <LinkedInIcon className="w-5 h-5" />
        </button>
      </div>
      
      {/* Switch to Login */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={switchTab}
        >
          Log in
        </button>
      </p>
    </div>
  );
}

export default RegisterForm;