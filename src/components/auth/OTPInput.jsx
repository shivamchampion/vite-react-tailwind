import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';

const OTPInput = ({ 
  method = 'phone', // 'phone' or 'whatsapp'
  phoneNumber,
  onVerificationComplete 
}) => {
  const { 
    sendPhoneOTP, 
    verifyPhoneOTP,
    sendWhatsAppOTP,
    verifyWhatsAppOTP 
  } = useAuth();

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const otpInputRefs = useRef([]);

  // Countdown for OTP resend
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Send initial OTP
  useEffect(() => {
    const sendOTP = async () => {
      setLoading(true);
      try {
        if (method === 'phone') {
          await sendPhoneOTP(phoneNumber);
        } else {
          await sendWhatsAppOTP(phoneNumber);
        }
        setResendTimer(60);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    sendOTP();
  }, [phoneNumber, method, sendPhoneOTP, sendWhatsAppOTP]);

  // Handle OTP input change
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input
    if (element.value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  // Handle OTP verification
  const handleVerify = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let verifiedUser;
      if (method === 'phone') {
        verifiedUser = await verifyPhoneOTP(otpCode);
      } else {
        verifiedUser = await verifyWhatsAppOTP(phoneNumber, otpCode);
      }

      setSuccess(true);
      onVerificationComplete(verifiedUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setError(null);
    setOtp(new Array(6).fill(''));

    try {
      if (method === 'phone') {
        await sendPhoneOTP(phoneNumber);
      } else {
        await sendWhatsAppOTP(phoneNumber);
      }
      setResendTimer(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Error Handling */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center mb-4">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center mb-4">
          <CheckCircle size={16} className="mr-2 flex-shrink-0" />
          <span>Verification successful!</span>
        </div>
      )}

      {/* OTP Heading */}
      <h2 className="text-xl font-bold text-center mb-4">
        Verify {method === 'phone' ? 'Phone' : 'WhatsApp'} Number
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter the 6-digit OTP sent to {phoneNumber}
      </p>

      {/* OTP Input Fields */}
      <div className="flex justify-center space-x-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            ref={(ref) => otpInputRefs.current[index] = ref}
            onChange={(e) => handleChange(e.target, index)}
            onFocus={(e) => e.target.select()}
            className="w-10 h-12 text-center border border-gray-300 rounded-md text-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={loading || success}
        className={`w-full py-3 rounded-md text-white font-medium ${
          loading || success
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Verifying...' : success ? 'Verified' : 'Verify OTP'}
      </button>

      {/* Resend OTP */}
      <div className="text-center mt-4">
        {resendTimer > 0 ? (
          <p className="text-gray-600">
            Resend OTP in {resendTimer} seconds
          </p>
        ) : (
          <button
            onClick={handleResendOTP}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OTPInput;