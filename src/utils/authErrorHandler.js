class AuthErrorHandler {
    // Map Firebase authentication errors to user-friendly messages
    static mapFirebaseError(error) {
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
  
    // Handle authentication errors with advanced logging
    static handleError(error, context = {}) {
      const userMessage = this.mapFirebaseError(error);
      
      // Optional: Log to error tracking service
      this.logError({
        message: userMessage,
        originalError: error,
        context
      });
  
      return {
        success: false,
        message: userMessage,
        code: error.code,
        ...context
      };
    }
  
    // Logging mechanism
    static logError(errorInfo) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        ...errorInfo
      };
  
      // In a real app, send to error tracking service
      console.error('AUTH ERROR LOG:', JSON.stringify(logEntry, null, 2));
    }
  }
  
  export default AuthErrorHandler;