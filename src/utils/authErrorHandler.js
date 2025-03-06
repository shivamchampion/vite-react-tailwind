// src/utils/authErrorHandler.js

/**
 * Comprehensive Authentication Error Handler
 */
class AuthErrorHandler {
    /**
     * Map Firebase authentication errors to user-friendly messages
     * @param {Error} error - Firebase authentication error
     * @returns {string} User-friendly error message
     */
    static mapFirebaseError(error) {
      // Firebase error codes reference
      const errorMap = {
        // Authentication Errors
        'auth/invalid-email': 'The email address is not valid.',
        'auth/user-disabled': 'This user account has been disabled.',
        'auth/user-not-found': 'No user found with this email address.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        
        // Registration Errors
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/operation-not-allowed': 'Password sign-in is disabled for this project.',
        'auth/weak-password': 'The password is too weak. Please choose a stronger password.',
        
        // Credential Errors
        'auth/account-exists-with-different-credential': 
          'An account already exists with a different login method.',
        'auth/credential-already-in-use': 
          'These credentials are already associated with another account.',
        
        // Network and Misc Errors
        'auth/network-request-failed': 
          'Network error. Please check your connection and try again.',
        'auth/too-many-requests': 
          'Too many login attempts. Please wait a moment and try again.',
        
        // Default error
        'default': 'An unexpected error occurred. Please try again.'
      };
  
      // Extract error code or use default
      const errorCode = error.code || 'default';
      const errorMessage = errorMap[errorCode] || errorMap['default'];
  
      // Log the original error for debugging
      console.error('Authentication Error:', error);
  
      return errorMessage;
    }
  
    /**
     * Handle authentication errors with advanced logging
     * @param {Error} error - Authentication error
     * @param {object} context - Additional context about the error
     * @returns {object} Processed error information
     */
    static handleError(error, context = {}) {
      const userMessage = this.mapFirebaseError(error);
      
      // Log detailed error information
      this.logError({
        message: userMessage,
        originalError: error,
        context
      });
  
      return {
        success: false,
        message: userMessage,
        code: error.code,
        // Optional additional context
        ...context
      };
    }
  
    /**
     * Comprehensive error logging mechanism
     * @param {object} errorInfo - Error information
     */
    static logError(errorInfo) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        ...errorInfo
      };
  
      // In a production environment, send to a secure logging service
      console.error('AUTH ERROR LOG:', JSON.stringify(logEntry, null, 2));
  
      // Optional: Send to error tracking service
      this.reportToErrorTrackingService(logEntry);
    }
  
    /**
     * Report error to external error tracking service
     * @param {object} errorLog - Detailed error log
     */
    static reportToErrorTrackingService(errorLog) {
      // Implement integration with services like Sentry, Bugsnag, etc.
      // This is a placeholder for actual error reporting
      try {
        // Example with fetch (replace with actual error tracking service)
        fetch('/api/error-tracking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(errorLog)
        }).catch(console.error);
      } catch (reportError) {
        console.error('Error reporting failed:', reportError);
      }
    }
  
    /**
     * Generate a user-friendly guidance based on error type
     * @param {string} errorCode - Firebase error code
     * @returns {object} Guidance information
     */
    static getErrorGuidance(errorCode) {
      const guidanceMap = {
        'auth/wrong-password': {
          title: 'Incorrect Password',
          description: 'Having trouble logging in?',
          actions: [
            'Double-check your password',
            'Use "Forgot Password" to reset',
            'Ensure Caps Lock is off'
          ],
          recommendedAction: 'resetPassword'
        },
        'auth/user-not-found': {
          title: 'Account Not Found',
          description: 'No account associated with this email.',
          actions: [
            'Verify the email address',
            'Create a new account',
            'Check for typos'
          ],
          recommendedAction: 'register'
        },
        'auth/network-request-failed': {
          title: 'Network Connection Issue',
          description: 'Unable to complete authentication.',
          actions: [
            'Check your internet connection',
            'Try again in a moment',
            'Connect to a stable network'
          ],
          recommendedAction: 'retry'
        }
      };
  
      return guidanceMap[errorCode] || {
        title: 'Authentication Error',
        description: 'An unexpected error occurred.',
        actions: ['Try again', 'Contact support'],
        recommendedAction: 'retry'
      };
    }
  }
  
  export default AuthErrorHandler;