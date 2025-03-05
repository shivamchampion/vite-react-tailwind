/**
 * WhatsApp OTP Service
 * 
 * This service integrates with a third-party API to send OTPs via WhatsApp.
 * For India, affordable options include:
 * 1. Twilio (more established but slightly higher cost)
 * 2. MSG91 (popular in India, competitive pricing)
 * 3. Gupshup (good for India market)
 * 4. Kaleyra (formerly Solutions Infini - popular in India)
 * 5. Fast2SMS (very affordable for India market)
 *
 * This implementation uses a generic approach that can be adapted
 * to any provider. MSG91 is recommended for Indian market due to
 * its cost-effectiveness and reliability.
 */

// Constants
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

/**
 * Generate a random OTP of specified length
 * @param {number} length Length of the OTP
 * @returns {string} Generated OTP
 */
const generateOTP = (length = OTP_LENGTH) => {
  // Generate a random numeric OTP
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
};

/**
 * Send OTP via WhatsApp using the configured provider
 * @param {string} phoneNumber Phone number with country code (e.g., +919876543210)
 * @returns {Promise<Object>} Response with OTP details
 */
export const sendWhatsAppOTP = async (phoneNumber) => {
  try {
    // Generate OTP
    const otp = generateOTP();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + OTP_EXPIRY_MINUTES);
    
    // For development/testing, log the OTP in console
    if (import.meta.env.MODE === 'development') {
      console.log(`⚠️ DEV MODE: WhatsApp OTP for ${phoneNumber}: ${otp}`);
    }
    
    // Implementation for MSG91 (recommended for India)
    // Replace with your actual API integration
    
    const apiUrl = import.meta.env.VITE_MSG91_API_URL || 'https://api.msg91.com/api/v5/flow/';
    const authKey = import.meta.env.VITE_MSG91_AUTH_KEY;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': authKey
      },
      body: JSON.stringify({
        flow_id: import.meta.env.VITE_MSG91_FLOW_ID,
        sender: import.meta.env.VITE_MSG91_SENDER_ID,
        mobiles: phoneNumber.replace('+', ''),
        VAR1: otp,
        VAR2: OTP_EXPIRY_MINUTES
      })
    });
    
    const data = await response.json();
    
    // Store OTP in session storage (encrypted in real-world scenario)
    // In production, this should be stored in a secure server-side database
    const otpData = {
      phoneNumber,
      otp,
      expiryTime: expiryTime.toISOString(),
      attempts: 0
    };
    
    // In development mode, we store the OTP in sessionStorage for easy testing
    // In production, this would be handled server-side
    if (import.meta.env.MODE === 'development') {
      sessionStorage.setItem(`whatsapp_otp_${phoneNumber}`, JSON.stringify(otpData));
    }
    
    return {
      success: true,
      message: 'OTP sent successfully via WhatsApp',
      expiryMinutes: OTP_EXPIRY_MINUTES,
      phoneNumber
    };
  } catch (error) {
    console.error('Error sending WhatsApp OTP:', error);
    throw new Error('Failed to send OTP via WhatsApp');
  }
};

/**
 * Verify OTP sent via WhatsApp
 * @param {string} phoneNumber Phone number with country code
 * @param {string} otp OTP entered by user
 * @returns {Promise<Object>} Verification result
 */
export const verifyWhatsAppOTP = async (phoneNumber, otp) => {
  try {
    // In development mode, verify against the stored OTP
    if (import.meta.env.MODE === 'development') {
      const storedData = sessionStorage.getItem(`whatsapp_otp_${phoneNumber}`);
      
      if (!storedData) {
        throw new Error('No OTP found for this number. Please request a new OTP.');
      }
      
      const otpData = JSON.parse(storedData);
      
      // Check if OTP has expired
      if (new Date() > new Date(otpData.expiryTime)) {
        throw new Error('OTP has expired. Please request a new OTP.');
      }
      
      // Increment attempts
      otpData.attempts += 1;
      sessionStorage.setItem(`whatsapp_otp_${phoneNumber}`, JSON.stringify(otpData));
      
      // Check max attempts (3)
      if (otpData.attempts > 3) {
        sessionStorage.removeItem(`whatsapp_otp_${phoneNumber}`);
        throw new Error('Maximum verification attempts exceeded. Please request a new OTP.');
      }
      
      // Verify OTP
      if (otpData.otp !== otp) {
        throw new Error('Invalid OTP. Please try again.');
      }
      
      // Clear OTP data after successful verification
      sessionStorage.removeItem(`whatsapp_otp_${phoneNumber}`);
      
      return {
        success: true,
        message: 'OTP verified successfully',
        phoneNumber
      };
    }
    
    // In production, this would call your backend API to verify the OTP
    const response = await fetch('/api/auth/verify-whatsapp-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phoneNumber,
        otp
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'OTP verification failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying WhatsApp OTP:', error);
    throw error;
  }
};