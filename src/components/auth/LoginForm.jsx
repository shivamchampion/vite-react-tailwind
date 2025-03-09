import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Phone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SocialLoginButtons } from './SocialButtons';

/**
 * LoginForm Component
 * Supports email/password and phone OTP login with improved social options
 */
function LoginForm({ onClose, switchTab }) {
  // Get auth context
  const { 
    login, 
    loginGoogle, 
    loginFacebook, 
    loginLinkedIn, 
    sendOtp, 
    verifyOtp,
    error, 
    clearError,
  } = useAuth();
  
  // Auth method tabs state
  const [authMethod, setAuthMethod] = useState("email");
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Phone/OTP states
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Clear errors
  const clearAllErrors = () => {
    setFormError("");
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
    setPhone(formatted);
  };

  // Handle email login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    clearAllErrors();
    
    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setFormError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle social login
  const handleSocialLogin = async (provider) => {
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
          throw new Error('Invalid login provider');
      }
      
      onClose();
    } catch (err) {
      setFormError(err.message || `${provider} login failed`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle send OTP
  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setFormError("Please enter a valid 10-digit phone number");
      return;
    }
    
    clearAllErrors();
    setIsLoading(true);
    
    try {
      const formattedPhone = `+91${phone}`;
      
      // Send OTP via Auth Context
      const confirmation = await sendOtp(formattedPhone, 'recaptcha-container');
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setSuccess(`OTP sent to +91 ${phone}`);
    } catch (err) {
      setFormError(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle verify OTP
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
      
      {/* Recaptcha container for phone auth */}
      <div id="recaptcha-container"></div>
      
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
      
      {/* Email/Password Login Form */}
      {authMethod === "email" && (
        <form onSubmit={handleEmailLogin} className="space-y-4">
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003399] focus:border-[#003399] focus:outline-none"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button
                type="button"
                className="text-xs font-medium text-[#003399] hover:text-blue-800"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003399] focus:border-[#003399] focus:outline-none"
                placeholder="••••••••"
                disabled={isLoading}
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
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-[#003399] border-gray-300 rounded focus:ring-[#003399] focus:ring-offset-0"
              disabled={isLoading}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
              Remember me
            </label>
          </div>
          
          <button
            type="submit"
            className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-white font-medium ${
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      )}
      
      {/* Phone OTP Login */}
      {authMethod === "phone" && (
        <div className="space-y-4">
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
                    value={phone}
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
              {phone && phone.length !== 10 && !otpSent && (
                <p className="mt-1 text-xs text-amber-600">Please enter a 10-digit phone number</p>
              )}
            </div>
          </div>
          
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
          
          <button
            type="button"
            className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-white font-medium ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#003399] hover:bg-blue-800"
            }`}
            onClick={() => otpSent ? handleVerifyOTP() : handleSendOTP()}
            disabled={isLoading || (phone.length !== 10 && !otpSent)}
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
              otpSent ? "Verify OTP" : "Send OTP"
            )}
          </button>
          
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
      
      {/* Social Login Buttons - with improved components */}
      <SocialLoginButtons 
        onSocialLogin={handleSocialLogin} 
        isLoading={isLoading} 
      />
      
      {/* Register link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-[#003399] hover:text-blue-800 font-medium"
            onClick={switchTab}
          >
            Register Now
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;