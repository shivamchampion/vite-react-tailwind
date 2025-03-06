import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../contexts/AuthContext';

/**
 * AuthModal Component
 * Modal for authentication forms (login/register) with a professional blue theme
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {string} props.activeTab - The active tab ('login' or 'register')
 * @param {Function} props.setActiveTab - Function to switch between tabs
 */
function AuthModal({ isOpen, onClose, activeTab = 'login', setActiveTab }) {
  const modalRef = useRef(null);
  const { currentUser } = useAuth();
  const [closingAnimation, setClosingAnimation] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  // Close modal when user logs in
  useEffect(() => {
    if (currentUser && isOpen && !authSuccess) {
      // Set success state first
      setAuthSuccess(true);
      
      // Give a delay to show success message before closing
      const timer = setTimeout(() => {
        handleClose();
        // Reset auth success state after modal closes
        setTimeout(() => setAuthSuccess(false), 500);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [currentUser, isOpen]);
  
  // Close modal when pressing escape key or clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleOutsideClick);

    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Smooth closing animation
  const handleClose = () => {
    setClosingAnimation(true);
    setTimeout(() => {
      setClosingAnimation(false);
      onClose();
    }, 300);
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity ${
          closingAnimation ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ transitionDuration: '300ms' }}
      ></div>

      {/* Modal Content */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          ref={modalRef}
          className={`relative w-full max-w-md bg-white shadow-2xl rounded-xl overflow-hidden transform transition-all ${
            closingAnimation ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{ transitionDuration: '300ms' }}
        >
          {/* Close Button */}
          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
            onClick={handleClose}
          >
            <X size={20} />
            <span className="sr-only">Close</span>
          </button>

          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 pt-12 pb-6 px-6 text-center">
            <h2 className="text-2xl font-bold text-white">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-indigo-100">
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
                  ? 'text-indigo-700 border-b-2 border-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'register'
                  ? 'text-indigo-700 border-b-2 border-indigo-700'
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
              <LoginForm onClose={handleClose} switchTab={() => setActiveTab('register')} />
            ) : (
              <RegisterForm onClose={handleClose} switchTab={() => setActiveTab('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;