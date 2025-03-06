// src/utils/security.js

import CryptoJS from 'crypto-js';

class SecurityManager {
  // Encryption key (store securely, preferably in environment variables)
  static #SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

  /**
   * Encrypt sensitive data
   * @param {string} data - Data to encrypt
   * @returns {string} Encrypted data
   */
  static encrypt(data) {
    try {
      if (!this.#SECRET_KEY) {
        console.warn('Encryption key is not set');
        return data;
      }
      return CryptoJS.AES.encrypt(
        JSON.stringify(data), 
        this.#SECRET_KEY
      ).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return data;
    }
  }

  /**
   * Decrypt sensitive data
   * @param {string} encryptedData - Encrypted data to decrypt
   * @returns {object|string} Decrypted data
   */
  static decrypt(encryptedData) {
    try {
      if (!this.#SECRET_KEY) {
        console.warn('Decryption key is not set');
        return encryptedData;
      }
      const bytes = CryptoJS.AES.decrypt(
        encryptedData, 
        this.#SECRET_KEY
      );
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData;
    }
  }

  /**
   * Generate a secure random token
   * @param {number} length - Length of the token
   * @returns {string} Random token
   */
  static generateSecureToken(length = 32) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      token += charset[randomValues[i] % charset.length];
    }
    return token;
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {object} Validation result
   */
  static validatePassword(password) {
    const validations = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    return {
      isValid: Object.values(validations).every(Boolean),
      details: validations
    };
  }

  /**
   * Sanitize user input to prevent XSS
   * @param {string} input - Input to sanitize
   * @returns {string} Sanitized input
   */
  static sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  /**
   * Log security-related events
   * @param {string} event - Event description
   * @param {object} details - Additional event details
   */
  static logSecurityEvent(event, details = {}) {
    // In a real application, this would send logs to a secure logging service
    console.warn('SECURITY EVENT:', event, details);
  }
}

export default SecurityManager;