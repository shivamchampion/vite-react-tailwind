import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleIcon, FacebookIcon, LinkedInIcon } from '../icons/SocialIcons';

// Validation Utilities
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { 
    login, 
    register, 
    loginGoogle, 
    loginFacebook, 
    loginLinkedIn, 
    error, 
    clearError 
  } = useAuth();

  // Modal State
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Reset form when modal opens/changes
  useEffect(() => {
    // Reset form data and errors when modal opens or tab changes
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setFormError(null);
    setSuccessMessage(null);
    clearError();
  }, [isOpen, activeTab, clearError]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any existing form errors
    setFormError(null);
  };

  // Validate Form
  const validateForm = () => {
    // Email validation
    if (!validateEmail(formData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }

    // Password validation for registration
    if (activeTab === 'register') {
      // Name validation
      if (!formData.name || formData.name.trim().length < 2) {
        setFormError('Please enter a valid name');
        return false;
      }

      // Password strength validation
      if (!validatePassword(formData.password)) {
        setFormError('Password must be at least 8 characters long, contain uppercase, lowercase, and a number');
        return false;
      }

      // Password confirmation
      if (formData.password !== formData.confirmPassword) {
        setFormError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormError(null);
    setSuccessMessage(null);
    
    // Validate form
    if (!validateForm()) return;

    // Set loading state
    setLoading(true);

    try {
      if (activeTab === 'login') {
        // Login logic
        await login(formData.email, formData.password);
        setSuccessMessage('Login successful!');
        
        // Close modal after short delay
        setTimeout(onClose, 1500);
      } else {
        // Registration logic
        await register(
          formData.email, 
          formData.password, 
          formData.name
        );
        setSuccessMessage('Account created successfully!');
        
        // Close modal after short delay
        setTimeout(onClose, 1500);
      }
    } catch (err) {
      // Set error message
      setFormError(err.message || 'Authentication failed');
    } finally {
      // Reset loading state
      setLoading(false);
    }
  };

  // Social login handler
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setFormError(null);

    try {
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

      setSuccessMessage('Login successful!');
      
      // Close modal after short delay
      setTimeout(onClose, 1500);
    } catch (err) {
      setFormError(err.message || 'Social login failed');
    } finally {
      setLoading(false);
    }
  };

  // If modal is not open, return null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl">
          {/* Close Button */}
          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-6 px-6 text-center rounded-t-xl">
            <h2 className="text-2xl font-bold text-white">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-indigo-100">
              {activeTab === 'login' 
                ? 'Log in to access your account' 
                : 'Join Business Options'}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'login'
                  ? 'text-indigo-700 border-b-2 border-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'register'
                  ? 'text-indigo-700 border-b-2 border-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Error Message */}
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center">
                <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Conditional Name Field for Registration */}
            {activeTab === 'register' && (
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-400" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field for Registration */}
            {activeTab === 'register' && (
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md text-white font-medium transition-colors ${
                loading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading 
                ? 'Processing...' 
                : (activeTab === 'login' ? 'Log In' : 'Create Account')
              }
            </button>
          </form>

          {/* Social Login Section */}
          <div className="px-6 pb-6">
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">or continue with</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="flex justify-center items-center py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                aria-label="Sign in with Google"
              >
                <GoogleIcon />
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
                className="flex justify-center items-center py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                aria-label="Sign in with Facebook"
              >
                <FacebookIcon />
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('linkedin')}
                disabled={loading}
                className="flex justify-center items-center py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                aria-label="Sign in with LinkedIn"
              >
                <LinkedInIcon />
              </button>
            </div>
          </div>

          {/* Switch between Login and Register */}
          <div className="px-6 pb-6 text-center">
            <p className="text-sm text-gray-600">
              {activeTab === 'login' 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                className="text-indigo-600 hover:text-indigo-800 font-medium ml-1"
              >
                {activeTab === 'login' ? 'Register' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;