import React, { useState } from 'react';
import { Phone, CheckCircle, AlertCircle } from 'lucide-react';
import OTPInput from './OTPInput';
import { WhatsAppIcon } from '../icons/SocialIcons';

const WhatsAppVerification = ({ onVerificationComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('input');
  const [error, setError] = useState(null);

  // Validate phone number (same as PhoneVerification)
  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    const indianMobileRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;
    
    if (!indianMobileRegex.test(cleaned)) {
      setError('Please enter a valid Indian mobile number');
      return false;
    }
    
    return cleaned;
  };

  // Handle phone number submission
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    
    setError(null);
    
    const validNumber = validatePhoneNumber(phoneNumber);
    
    if (validNumber) {
      setStep('verify');
    }
  };

  // Handle successful verification
  const handleVerificationComplete = (user) => {
    onVerificationComplete(user);
  };

  // Render phone number input step
  const renderPhoneInput = () => (
    <form onSubmit={handlePhoneSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Error Handling */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center mb-4">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* WhatsApp Verification Heading */}
      <div className="flex justify-center mb-4">
        <WhatsAppIcon className="w-16 h-16 text-green-500" />
      </div>
      <h2 className="text-xl font-bold text-center mb-4">
        Verify via WhatsApp
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your mobile number to receive a WhatsApp verification OTP
      </p>

      {/* Phone Number Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone size={18} className="text-gray-400" />
        </div>
        <div className="absolute inset-y-0 left-0 pl-12 flex items-center pointer-events-none">
          <span className="text-gray-500">+91</span>
        </div>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          maxLength="10"
          placeholder="Enter 10-digit mobile number"
          className="w-full pl-24 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Send WhatsApp OTP
      </button>

      {/* Additional Information */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          We'll send a 6-digit OTP to your WhatsApp
        </p>
      </div>
    </form>
  );

  // Render OTP verification step
  const renderOTPVerification = () => (
    <OTPInput 
      method="whatsapp"
      phoneNumber={`+91${phoneNumber}`}
      onVerificationComplete={handleVerificationComplete}
    />
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      {step === 'input' ? renderPhoneInput() : renderOTPVerification()}
    </div>
  );
};

export default WhatsAppVerification;