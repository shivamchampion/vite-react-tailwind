// src/middleware/authMiddleware.js

import { 
    getAuth, 
    onAuthStateChanged, 
    getIdToken, 
    verifyIdToken 
  } from 'firebase/auth';
  import SecurityManager from '../utils/security';
  
  class AuthMiddleware {
    /**
     * Check if user is authenticated
     * @returns {Promise<object|null>} User authentication state
     */
    static async checkAuthStatus() {
      return new Promise((resolve, reject) => {
        const auth = getAuth();
        
        const unsubscribe = onAuthStateChanged(
          auth, 
          async (user) => {
            unsubscribe(); // Unsubscribe immediately
            
            if (user) {
              try {
                // Verify ID token
                const token = await getIdToken(user);
                const decodedToken = await verifyIdToken(token);
                
                // Additional security checks
                SecurityManager.logSecurityEvent('Auth Status Check', {
                  uid: user.uid,
                  email: user.email
                });
                
                resolve({
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  verified: user.emailVerified
                });
              } catch (error) {
                // Token verification failed
                SecurityManager.logSecurityEvent('Token Verification Failed', {
                  error: error.message
                });
                reject(error);
              }
            } else {
              resolve(null);
            }
          },
          (error) => {
            // Authentication state change error
            SecurityManager.logSecurityEvent('Auth State Error', {
              error: error.message
            });
            reject(error);
          }
        );
      });
    }
  
    /**
     * Protect routes requiring authentication
     * @param {Function} callback - Callback to execute if authenticated
     * @returns {Promise<any>} Result of callback or null
     */
    static async protectRoute(callback) {
      try {
        const user = await this.checkAuthStatus();
        
        if (!user) {
          // Redirect to login or show unauthorized message
          throw new Error('Unauthorized: Please log in');
        }
        
        // Execute callback with user context
        return await callback(user);
      } catch (error) {
        // Handle authentication errors
        SecurityManager.logSecurityEvent('Route Protection Failed', {
          error: error.message
        });
        
        // You might want to redirect to login or show an error
        throw error;
      }
    }
  
    /**
     * Role-based access control
     * @param {object} user - User object
     * @param {string[]} allowedRoles - Roles allowed to access the resource
     * @returns {boolean} Whether access is granted
     */
    static checkRoleAccess(user, allowedRoles) {
      if (!user || !user.role) {
        SecurityManager.logSecurityEvent('Role Access Denied', {
          reason: 'No user or role found'
        });
        return false;
      }
  
      const hasAccess = allowedRoles.includes(user.role);
      
      if (!hasAccess) {
        SecurityManager.logSecurityEvent('Role Access Denied', {
          userRole: user.role,
          allowedRoles
        });
      }
  
      return hasAccess;
    }
  
    /**
     * Rate limit authentication attempts
     */
    static rateLimitAuthAttempts() {
      // In-memory store of auth attempts (replace with Redis in production)
      const authAttempts = new Map();
  
      return {
        /**
         * Check if authentication attempt is allowed
         * @param {string} identifier - User identifier (IP or email)
         * @param {number} maxAttempts - Maximum allowed attempts
         * @param {number} windowMs - Time window in milliseconds
         * @returns {boolean} Whether attempt is allowed
         */
        checkAttempt(identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
            const now = Date.now();
            const attempts = authAttempts.get(identifier) || [];
            
            // Remove old attempts
            const recentAttempts = attempts.filter(attempt => now - attempt < windowMs);
            
            // Check if max attempts exceeded
            if (recentAttempts.length >= maxAttempts) {
              SecurityManager.logSecurityEvent('Rate Limit Exceeded', {
                identifier,
                attempts: recentAttempts.length
              });
              return false;
            }
            
            // Add new attempt
            recentAttempts.push(now);
            authAttempts.set(identifier, recentAttempts);
            
            return true;
          },
    
          /**
           * Reset attempts for an identifier
           * @param {string} identifier - User identifier
           */
          resetAttempts(identifier) {
            authAttempts.delete(identifier);
          }
        };
      }
    
      /**
       * Two-Factor Authentication (2FA) management
       */
      static twoFactorAuth = {
        /**
         * Generate 2FA secret
         * @returns {string} 2FA secret
         */
        generateSecret() {
          // Use a secure random generator
          return SecurityManager.generateSecureToken(20);
        },
    
        /**
         * Verify 2FA code
         * @param {string} secret - 2FA secret
         * @param {string} userCode - User-provided code
         * @returns {boolean} Whether code is valid
         */
        verifyCode(secret, userCode) {
          // In a real implementation, use a library like speakeasy
          // This is a simplified example
          const expectedCode = this.generateTOTPCode(secret);
          return userCode === expectedCode;
        },
    
        /**
         * Generate Time-based One-Time Password (TOTP)
         * @param {string} secret - 2FA secret
         * @returns {string} TOTP code
         */
        generateTOTPCode(secret) {
          // Simplified TOTP generation
          const now = Math.floor(Date.now() / 30000); // 30-second intervals
          const hash = CryptoJS.HmacSHA1(
            now.toString(), 
            secret
          );
          
          // Convert hash to 6-digit code
          const offset = hash.words[19] & 0xf;
          const code = (
            ((hash.words[offset] & 0x7fffffff) % 1000000)
              .toString()
              .padStart(6, '0')
          );
          
          return code;
        }
      };
    
      /**
       * Detect and prevent suspicious login activities
       * @param {object} loginAttempt - Login attempt details
       * @returns {Promise<boolean>} Whether login is suspicious
       */
      static async detectSuspiciousActivity(loginAttempt) {
        // Implement multi-layered suspicious activity detection
        const checks = [
          // Check for unusual login locations
          this.checkLoginLocation(loginAttempt),
          
          // Check for rapid successive login attempts
          this.checkLoginFrequency(loginAttempt),
          
          // Check against known compromised credentials
          this.checkCompromisedCredentials(loginAttempt)
        ];
    
        // Perform all checks
        const suspiciousResults = await Promise.all(checks);
        
        // If any check returns true, consider it suspicious
        const isSuspicious = suspiciousResults.some(result => result);
        
        if (isSuspicious) {
          SecurityManager.logSecurityEvent('Suspicious Login Detected', loginAttempt);
        }
        
        return isSuspicious;
      }
    
      /**
       * Check login location for anomalies
       * @param {object} loginAttempt - Login attempt details
       * @returns {Promise<boolean>} Whether location is suspicious
       */
      static async checkLoginLocation(loginAttempt) {
        try {
          // In a real-world scenario, use a geolocation IP lookup service
          // Check against user's previous login locations
          const response = await fetch(`https://ipapi.co/${loginAttempt.ip}/json/`);
          const locationData = await response.json();
          
          // Example checks:
          // 1. Detect logins from significantly different countries
          // 2. Check against user's typical login locations
          // 3. Look for known VPN or proxy IP ranges
          
          return false; // Placeholder
        } catch (error) {
          console.error('Location check failed:', error);
          return false;
        }
      }
    
      /**
       * Check login frequency for potential brute force attempts
       * @param {object} loginAttempt - Login attempt details
       * @returns {Promise<boolean>} Whether login frequency is suspicious
       */
      static async checkLoginFrequency(loginAttempt) {
        // Implement logic to detect rapid successive login attempts
        // This could involve checking:
        // 1. Number of attempts from same IP
        // 2. Time between login attempts
        // 3. Unusual login patterns
        
        return false; // Placeholder
      }
    
      /**
       * Check against known compromised credentials
       * @param {object} loginAttempt - Login attempt details
       * @returns {Promise<boolean>} Whether credentials are compromised
       */
      static async checkCompromisedCredentials(loginAttempt) {
        try {
          // Use a service like HaveIBeenPwned to check credential exposure
          const response = await fetch(
            `https://api.pwnedpasswords.com/range/${loginAttempt.passwordHash.substring(0, 5)}`
          );
          const pwdResults = await response.text();
          
          // Check if password hash suffix exists in leaked passwords
          return pwdResults
            .split('\n')
            .some(line => line.startsWith(loginAttempt.passwordHash.substring(5)));
        } catch (error) {
          console.error('Credential check failed:', error);
          return false;
        }
      }
    }
    
    export default AuthMiddleware;