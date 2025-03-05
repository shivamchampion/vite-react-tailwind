import React from 'react';

/**
 * GoogleIcon Component
 * SVG icon for Google
 */
export const GoogleIcon = ({ className = 'w-5 h-5' }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path 
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
      fill="#4285F4" 
    />
    <path 
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
      fill="#34A853" 
    />
    <path 
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
      fill="#FBBC05" 
    />
    <path 
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
      fill="#EA4335" 
    />
  </svg>
);

/**
 * FacebookIcon Component
 * SVG icon for Facebook
 */
export const FacebookIcon = ({ className = 'w-5 h-5' }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path 
      d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" 
      fill="#1877F2" 
    />
  </svg>
);

/**
 * LinkedInIcon Component
 * SVG icon for LinkedIn
 */
export const LinkedInIcon = ({ className = 'w-5 h-5' }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect 
      width="20" 
      height="20" 
      fill="#0077B5" 
      x="2" 
      y="2" 
      rx="2" 
      ry="2" 
    />
    <path 
      d="M8 8h2v8H8z" 
      fill="white" 
    />
    <path 
      d="M9 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" 
      fill="white" 
    />
    <path 
      d="M16 16v-4c0-1.1-.9-2-2-2s-2 .9-2 2v4" 
      stroke="white"
      strokeWidth="2"
      fill="none"
    />
    <path 
      d="M12 12h4" 
      stroke="white"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

/**
 * WhatsAppIcon Component
 * SVG icon for WhatsApp
 */
export const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path 
      d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5l-.85 3.08c-.11.42.25.77.67.67L6.25 20c1.47.86 3.18 1.35 5 1.35 5.52 0 10-4.48 10-10S17.52 2 12 2z" 
      fill="#25D366" 
    />
    <path 
      d="M16.75 14.46c-.4-.2-2.37-1.17-2.73-1.3-.36-.14-.63-.2-.9.2-.26.41-1.02 1.3-1.25 1.57-.22.26-.45.3-.85.1-2.31-1.15-3.82-2.07-5.35-4.69-.4-.7.4-.65 1.16-2.17.13-.26.07-.49-.03-.69-.1-.2-.9-2.18-1.24-2.98-.33-.78-.66-.67-.9-.68-.23-.02-.5-.02-.76-.02s-.7.1-.89.33c-1.72 1.84-.91 4.14.13 5.65 1.98 2.83 4 4.22 6.7 5.55.93.33 1.76.71 2.4.92.99.33 1.9.28 2.62.17.8-.12 2.45-1 2.8-1.96.34-.96.34-1.79.24-1.96-.1-.18-.37-.28-.77-.48z" 
      fill="white" 
    />
  </svg>
);

/**
 * PhoneIcon Component
 * SVG icon for Phone
 */
export const PhoneIcon = ({ className = 'w-5 h-5' }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="none"
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

/**
 * EmailIcon Component
 * SVG icon for Email
 */
export const EmailIcon = ({ className = 'w-5 h-5' }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    fill="none"
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export default {
  GoogleIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
  PhoneIcon,
  EmailIcon
};