import React from 'react';
import { GoogleIcon, FacebookIcon, LinkedInIcon, WhatsAppIcon } from '../icons/SocialIcons';

/**
 * SocialButton Component - Consistent styling for social media login buttons
 */
const SocialButton = ({ provider, onClick, disabled, children }) => {
  // Styling configuration based on provider
  const config = {
    google: {
      bg: 'bg-white',
      hover: 'hover:bg-gray-50',
      border: 'border border-gray-300',
      text: 'text-gray-700',
      icon: <GoogleIcon />
    },
    facebook: {
      bg: 'bg-[#1877F2]', 
      hover: 'hover:bg-[#0b5fcc]',
      border: '',
      text: 'text-white',
      icon: <FacebookIcon />
    },
    linkedin: {
      bg: 'bg-[#0A66C2]',
      hover: 'hover:bg-[#084b8e]',
      border: '',
      text: 'text-white',
      icon: <LinkedInIcon />
    },
    whatsapp: {
      bg: 'bg-[#25D366]',
      hover: 'hover:bg-[#1da851]',
      border: '',
      text: 'text-white',
      icon: <WhatsAppIcon />
    }
  };

  const style = config[provider] || config.google;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg 
        ${style.bg} ${style.hover} ${style.border} ${style.text}
        transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      <span className="flex items-center justify-center w-5 h-5 mr-3">
        {style.icon}
      </span>
      <span className="font-medium">{children}</span>
    </button>
  );
};

/**
 * Social Login Buttons Group Component
 */
export const SocialLoginButtons = ({ onSocialLogin, isLoading }) => {
  return (
    <div className="space-y-3">
      <SocialButton 
        provider="google" 
        onClick={() => onSocialLogin('google')} 
        disabled={isLoading}
      >
        Continue with Google
      </SocialButton>
      
      <SocialButton 
        provider="facebook" 
        onClick={() => onSocialLogin('facebook')} 
        disabled={isLoading}
      >
        Continue with Facebook
      </SocialButton>
      
      <SocialButton 
        provider="linkedin" 
        onClick={() => onSocialLogin('linkedin')} 
        disabled={isLoading}
      >
        Continue with LinkedIn
      </SocialButton>
      
      <SocialButton 
        provider="whatsapp" 
        onClick={() => onSocialLogin('whatsapp')} 
        disabled={isLoading}
      >
        Continue with WhatsApp
      </SocialButton>
    </div>
  );
};

/**
 * Social Registration Buttons Group Component
 */
export const SocialRegisterButtons = ({ onSocialRegister, isLoading }) => {
  return (
    <div className="space-y-3">
      <SocialButton 
        provider="google" 
        onClick={() => onSocialRegister('google')} 
        disabled={isLoading}
      >
        Register with Google
      </SocialButton>
      
      <SocialButton 
        provider="facebook" 
        onClick={() => onSocialRegister('facebook')} 
        disabled={isLoading}
      >
        Register with Facebook
      </SocialButton>
      
      <SocialButton 
        provider="linkedin" 
        onClick={() => onSocialRegister('linkedin')} 
        disabled={isLoading}
      >
        Register with LinkedIn
      </SocialButton>
      
      <SocialButton 
        provider="whatsapp" 
        onClick={() => onSocialRegister('whatsapp')} 
        disabled={isLoading}
      >
        Register with WhatsApp
      </SocialButton>
    </div>
  );
};