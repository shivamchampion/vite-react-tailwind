import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

/**
 * AuthModal Component
 * Modal for authentication forms (login/register) with a professional blue theme
 */
function AuthModal({ isOpen, onClose, activeTab = 'login', setActiveTab }) {
  // Close modal when pressing escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    
    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white shadow-2xl rounded-xl overflow-hidden transform transition-all">
          {/* Close Button */}
          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
            onClick={onClose}
          >
            <X size={20} />
            <span className="sr-only">Close</span>
          </button>

          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-[#003399] to-[#004ccf] pt-12 pb-6 px-6 text-center">
            <h2 className="text-2xl font-bold text-white">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-blue-100">
              {activeTab === 'login' 
                ? 'Log in to access your account' 
                : 'Join Business Options to connect with opportunities'}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'login'
                  ? 'text-[#003399] border-b-2 border-[#003399]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'register'
                  ? 'text-[#003399] border-b-2 border-[#003399]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {activeTab === 'login' ? (
              <LoginForm onClose={onClose} switchTab={() => setActiveTab('register')} />
            ) : (
              <RegisterForm onClose={onClose} switchTab={() => setActiveTab('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;