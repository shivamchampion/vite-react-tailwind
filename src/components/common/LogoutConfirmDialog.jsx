import React from 'react';
import { X, LogOut } from 'lucide-react';

/**
 * Logout Confirmation Dialog Component
 * Displays a modal dialog confirming user logout
 */
export const LogoutConfirmDialog = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  // Prevent clicks on the modal from closing it
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-4"
        onClick={stopPropagation}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-yellow-100 py-3 px-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Log Out
          </h3>
          <button
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-4">
              <LogOut size={24} />
            </div>
            <div>
              <p className="text-gray-500">
                Are you sure you want to log out of your account?
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className={`w-full sm:w-auto sm:ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-white font-medium sm:text-sm hover:bg-yellow-700 focus:outline-none ${
              isLoading ? 'opacity-70 cursor-not-allowed bg-yellow-400' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              onConfirm();
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Log Out'}
          </button>
          <button
            type="button"
            className="mt-3 sm:mt-0 w-full sm:w-auto sm:ml-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 font-medium sm:text-sm hover:bg-gray-50 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              onClose();
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};