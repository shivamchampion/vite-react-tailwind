import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Shield,
  Check,
  X,
  Phone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SocialRegisterButtons } from './SocialButtons';

/**
 * RegisterForm Component
 * Supports both email and phone registration with improved styling
 */
function RegisterForm({ onClose, switchTab }) {
  // Get auth context
  const { 
    register,
    loginGoogle, 
    loginFacebook, 
    loginLinkedIn,
    sendOtp,
    verifyOtp,
    error, 
    clearError 
  } = useAuth();
  
  // Auth method tabs state
  const [authMethod, setAuthMethod] = useState("email");
  
  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Phone form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  // UI state
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Clear all errors
  const clearAllErrors = () => {
    setFormError('');
    clearError();
  };
  
  // Format phone number for display
  const formatPhoneInput = (value) => {
    // Remove all non-digits
    const numberOnly = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    return numberOnly.substring(0, 10);
  };
  
  // Handle phone number input
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneInput(e.target.value);
    setPhoneNumber(formatted);
  };
  
  // Check password strength
  const checkPasswordStrength = (newPassword) => {
    let strength = 0;
    
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    
    setPasswordStrength(strength);
  };
  
  // Handle form input changes
  const handleChange = (e, field) => {
    const value = e.target.value;
    
    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
      checkPasswordStrength(value);
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };
  
  // Handle email registration
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    clearAllErrors();
    
    // Validation
    if (!email) {
      setFormError('Email is required');
      return;
    }
    
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (!acceptTerms) {
      setFormError('You must accept the Terms of Service and Privacy Policy');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(email, password);
      onClose();
    } catch (err) {
      setFormError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle OTP send
  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setFormError("Please enter a valid 10-digit phone number");
      return;
    }
    
    if (!acceptTerms) {
      setFormError('You must accept the Terms of Service and Privacy Policy');
      return;
    }
    
    clearAllErrors();
    setIsLoading(true);
    
    try {
      const formattedPhone = `+91${phoneNumber}`;
      
      // Send OTP via Auth Context
      const confirmation = await sendOtp(formattedPhone, 'recaptcha-phone-container');
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setSuccess(`OTP sent to +91 ${phoneNumber}`);
    } catch (err) {
      setFormError(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setFormError("Please enter a valid OTP");
      return;
    }
    
    clearAllErrors();
    setIsLoading(true);
    
    try {
      await verifyOtp(otp);
      onClose();
    } catch (err) {
      setFormError(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle social registration
  const handleSocialRegister = async (provider) => {
    clearAllErrors();
    setIsLoading(true);
    
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
          throw new Error('Invalid provider');
      }
      
      onClose();
    } catch (err) {
      setFormError(err.message || `${provider} registration failed`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Password strength indicator
  const renderPasswordStrength = () => {
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const textColors = ['text-red-700', 'text-yellow-700', 'text-blue-700', 'text-green-700'];
    
    return (
      <div className="mt-2">
        <div className="flex h-1.5 w-full space-x-1 rounded-full bg-gray-100 p-0.5">
          {[1, 2, 3, 4].map((segment) => (
            <div
              key={segment}
              className={`h-full flex-1 rounded-full transition-all duration-300 ${
                passwordStrength >= segment ? colors[passwordStrength - 1] : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>
        {password && (
          <div className="mt-1.5 flex items-center">
            <div className={`w-2 h-2 rounded-full mr-1.5 ${passwordStrength > 0 ? colors[passwordStrength - 1] : 'bg-gray-300'}`}></div>
            <p className={`text-xs font-medium ${passwordStrength > 0 ? textColors[passwordStrength - 1] : 'text-gray-500'}`}>
              {passwordStrength === 0 ? 'Password too weak' : `Password strength: ${labels[passwordStrength - 1]}`}
            </p>
          </div>
        )}

        {password && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { check: password.length >= 8, label: 'At least 8 characters' },
              { check: /[A-Z]/.test(password), label: 'Uppercase letter' },
              { check: /[0-9]/.test(password), label: 'Number' },
              { check: /[^A-Za-z0-9]/.test(password), label: 'Special character' }
            ].map((criteria, index) => (
              <div key={index} className="flex items-center text-xs">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-1.5 ${
                  criteria.check 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {criteria.check ? <Check size={10} /> : <X size={10} />}
                </div>
                <span className={criteria.check ? 'text-gray-700' : 'text-gray-500'}>
                  {criteria.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-5">
      {/* Auth method tabs */}
      <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
        <button
          type="button"
          onClick={() => {
            setAuthMethod("email");
            clearAllErrors();
          }}
          className={`flex-1 flex items-center justify-center py-2 px-3 text-sm font-medium rounded ${
            authMethod === "email"
              ? "bg-white text-[#003399] shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Mail size={16} className="mr-2" />
          Email
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMethod("phone");
            setOtpSent(false);
            setOtp("");
            clearAllErrors();
          }}
          className={`flex-1 flex items-center justify-center py-2 px-3 text-sm font-medium rounded ${
            authMethod === "phone"
              ? "bg-white text-[#003399] shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Phone size={16} className="mr-2" />
          Phone
        </button>
      </div>
      
      {/* Recaptcha container for phone registration */}
      <div id="recaptcha-phone-container"></div>
      
      {/* Error message */}
      {(formError || error) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
          <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{formError || error}</p>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <p className="text-sm">{success}</p>
        </div>
      )}
      
      {/* EMAIL REGISTRATION FORM */}
      {authMethod === "email" && (
        <form onSubmit={handleEmailRegister} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleChange(e, 'email')}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003399] focus:border-[#003399] focus:outline-none"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handleChange(e, 'password')}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003399] focus:border-[#003399] focus:outline-none"
                placeholder="••••••••"
                disabled={isLoading}
                minLength={8}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {renderPasswordStrength()}
          </div>
          
          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Shield size={18} className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => handleChange(e, 'confirmPassword')}
                className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:outline-none ${
                  confirmPassword && confirmPassword !== password
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : confirmPassword && confirmPassword === password
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 focus:ring-[#003399] focus:border-[#003399]'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && confirmPassword === password && (
              <div className="flex items-center mt-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
                <p className="text-xs text-green-700">Passwords match</p>
              </div>
            )}
          </div>
          
          {/* Terms Checkbox */}
          <div className="flex items-start mt-2">
            <input
              id="accept-terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
              className="h-4 w-4 mt-1 text-[#003399] border-gray-300 rounded focus:ring-[#003399] focus:ring-offset-0"
              disabled={isLoading}
            />
            <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-[#003399] hover:text-blue-800">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-[#003399] hover:text-blue-800">Privacy Policy</a>
            </label>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full flex items-center justify-center py-2.5 px-4 mt-4 rounded-lg text-white font-medium ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#003399] hover:bg-blue-800"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      )}
      
      {/* PHONE REGISTRATION FORM */}
      {authMethod === "phone" && (
        <div className="space-y-4">
          {/* Phone Number Field - with fixed country code */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="flex">
                <div className="flex-shrink-0 z-10">
                  <span className={`inline-flex items-center px-4 py-2.5 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-700 font-medium ${
                    otpSent ? 'opacity-75' : ''
                  }`}>
                    +91
                  </span>
                </div>
                <div className="relative flex-grow">
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className={`block w-full rounded-r-lg border border-gray-300 py-2.5 px-3 focus:ring-2 focus:ring-[#003399] focus:border-[#003399] focus:z-10 focus:outline-none ${
                      otpSent ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    placeholder="9876543210"
                    maxLength={10}
                    disabled={isLoading || otpSent}
                  />
                </div>
              </div>
              {phoneNumber && phoneNumber.length !== 10 && !otpSent && (
                <p className="mt-1 text-xs text-amber-600">Please enter a 10-digit phone number</p>
              )}
            </div>
          </div>
          
          {/* OTP Field - shown after OTP is sent */}
          {otpSent && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003399] focus:border-[#003399] focus:outline-none text-center font-mono tracking-widest"
                disabled={isLoading}
                maxLength={6}
              />
            </div>
          )}
          
          {/* Terms Checkbox */}
          {!otpSent && (
            <div className="flex items-start mt-2">
              <input
                id="accept-terms-phone"
                type="checkbox"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
                className="h-4 w-4 mt-1 text-[#003399] border-gray-300 rounded focus:ring-[#003399] focus:ring-offset-0"
                disabled={isLoading}
              />
              <label htmlFor="accept-terms-phone" className="ml-2 block text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-[#003399] hover:text-blue-800">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-[#003399] hover:text-blue-800">Privacy Policy</a>
              </label>
            </div>
          )}
          
          {/* OTP Button */}
          <button
            type="button"
            className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-white font-medium ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#003399] hover:bg-blue-800"
            }`}
            onClick={() => otpSent ? handleVerifyOTP() : handleSendOTP()}
            disabled={isLoading || (phoneNumber.length !== 10 && !otpSent) || (!acceptTerms && !otpSent)}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {otpSent ? "Verifying..." : "Sending OTP..."}
              </>
            ) : (
              otpSent ? "Verify & Create Account" : "Send Verification Code"
            )}
          </button>
          
          {/* Change Number Link */}
          {otpSent && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-[#003399] hover:text-blue-800"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
                disabled={isLoading}
              >
                Change number
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-white text-sm text-gray-500">OR</span>
        </div>
      </div>
      
      {/* Social Registration Buttons */}
      <SocialRegisterButtons 
        onSocialRegister={handleSocialRegister} 
        isLoading={isLoading} 
      />
      
      {/* Login link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            className="text-[#003399] hover:text-blue-800 font-medium"
            onClick={switchTab}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;