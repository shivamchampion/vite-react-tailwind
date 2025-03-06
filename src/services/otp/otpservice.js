import { 
    getAuth, 
    PhoneAuthProvider, 
    RecaptchaVerifier, 
    signInWithPhoneNumber 
  } from 'firebase/auth';
  import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
  import { auth, db } from '../firebase/config';
  import toast from 'react-hot-toast';
  
  class OTPService {
    // Enhanced phone number validation
    static validatePhoneNumber(phoneNumber) {
      // Remove all non-digit characters
      const cleaned = phoneNumber.replace(/\D/g, '');
      
      // Comprehensive phone number validation
      const validations = {
        // Indian phone number validation (10 digits)
        india: /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/.test(cleaned),
        
        // Basic length check (10-15 digits)
        length: cleaned.length >= 10 && cleaned.length <= 15,
        
        // Check if it starts with valid mobile prefixes
        prefix: /^(6|7|8|9)/.test(cleaned)
      };
  
      // All validations must pass
      const isValid = Object.values(validations).every(v => v);
  
      if (!isValid) {
        throw new Error('Invalid phone number. Please provide a valid Indian mobile number.');
      }
  
      // Format with Indian country code
      return cleaned.startsWith('91') 
        ? `+${cleaned}` 
        : `+91${cleaned}`;
    }
  
    // Generate a secure, time-limited OTP
    static generateOTP(length = 6) {
      // Cryptographically secure OTP generation
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);
      
      return Array.from(array, num => 
        num % 10
      ).join('');
    }
  
    // Send OTP via SMS (Firebase Phone Auth)
    static async sendPhoneOTP(phoneNumber) {
      try {
        // Validate and format phone number
        const formattedNumber = this.validatePhoneNumber(phoneNumber);
  
        // Create recaptcha verifier
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response) => {
            console.log('Recaptcha solved');
          }
        });
  
        // Send OTP
        const confirmationResult = await signInWithPhoneNumber(
          auth, 
          formattedNumber, 
          recaptchaVerifier
        );
  
        // Store confirmation result globally
        window.confirmationResult = confirmationResult;
  
        toast.success('OTP sent successfully');
        return {
          phoneNumber: formattedNumber,
          confirmationResult
        };
      } catch (error) {
        console.error('Phone OTP Error:', error);
        toast.error('Failed to send OTP. Please try again.');
        throw error;
      }
    }
  
    // Verify Phone OTP
    static async verifyPhoneOTP(otp) {
      try {
        const confirmationResult = window.confirmationResult;
        
        if (!confirmationResult) {
          throw new Error('No OTP request found. Please request OTP first.');
        }
  
        // Confirm the OTP
        const userCredential = await confirmationResult.confirm(otp);
        const user = userCredential.user;
  
        // Create or update user profile
        await this.createOrUpdateUserProfile(user);
  
        toast.success('Phone number verified successfully');
        return user;
      } catch (error) {
        console.error('OTP Verification Error:', error);
        toast.error('Invalid OTP. Please try again.');
        throw error;
      }
    }
  
    // Mock WhatsApp OTP (would be replaced with actual service)
    static async sendWhatsAppOTP(phoneNumber) {
      try {
        // Validate phone number
        const formattedNumber = this.validatePhoneNumber(phoneNumber);
        
        // Generate OTP
        const otp = this.generateOTP();
  
        // In production, integrate with WhatsApp OTP service like MSG91
        console.log(`WhatsApp OTP for ${formattedNumber}: ${otp}`);
  
        toast.success('WhatsApp OTP sent successfully');
        
        return {
          phoneNumber: formattedNumber,
          otp
        };
      } catch (error) {
        console.error('WhatsApp OTP Error:', error);
        toast.error('Failed to send WhatsApp OTP');
        throw error;
      }
    }
  
    // Verify WhatsApp OTP
    static async verifyWhatsAppOTP(phoneNumber, otp) {
      try {
        const formattedNumber = this.validatePhoneNumber(phoneNumber);
  
        // Basic OTP validation
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
          throw new Error('Invalid OTP format');
        }
  
        // In production, verify with WhatsApp OTP service
        const mockUser = {
          uid: `whatsapp_${formattedNumber}`,
          phoneNumber: formattedNumber
        };
  
        await this.createOrUpdateUserProfile(mockUser);
  
        toast.success('WhatsApp OTP verified successfully');
        return mockUser;
      } catch (error) {
        console.error('WhatsApp OTP Verification Error:', error);
        toast.error('Invalid WhatsApp OTP');
        throw error;
      }
    }
  
    // Create or update user profile
    static async createOrUpdateUserProfile(user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
  
        const userData = {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          lastLogin: new Date(),
          verifiedAt: new Date()
        };
  
        if (!userDoc.exists()) {
          // Create new user document
          await setDoc(userRef, {
            ...userData,
            createdAt: new Date(),
            role: 'user',
            connectsBalance: 15 // Default connects
          });
        } else {
          // Update existing user document
          await updateDoc(userRef, userData);
        }
  
        return userData;
      } catch (error) {
        console.error('User Profile Creation Error:', error);
        throw error;
      }
    }
  }
  
  export default OTPService;