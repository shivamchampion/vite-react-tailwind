import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, LogOut, Trash2, Save, X, Info } from 'lucide-react';

/**
 * Reusable Confirmation Dialog Component
 * 
 * A flexible, customizable dialog for confirming user actions
 * with built-in variants for different confirmation types
 */
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default", // default, danger, warning, success
  iconType = "alert", // alert, warning, logout, delete, save
  isLoading = false,
  customIcon = null
}) => {
  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  React.useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Determine variant styles
  const getVariantStyles = () => {
    const styles = {
      default: {
        headerBg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        headerBorder: 'border-blue-100',
        iconBg: 'bg-blue-100 text-blue-600',
        confirmBg: 'bg-blue-600 hover:bg-blue-700 text-white',
        confirmBgLoading: 'bg-blue-400',
      },
      danger: {
        headerBg: 'bg-gradient-to-r from-red-50 to-red-100',
        headerBorder: 'border-red-100',
        iconBg: 'bg-red-100 text-red-600',
        confirmBg: 'bg-red-600 hover:bg-red-700 text-white',
        confirmBgLoading: 'bg-red-400',
      },
      warning: {
        headerBg: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
        headerBorder: 'border-yellow-100',
        iconBg: 'bg-yellow-100 text-yellow-600',
        confirmBg: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        confirmBgLoading: 'bg-yellow-400',
      },
      success: {
        headerBg: 'bg-gradient-to-r from-green-50 to-green-100',
        headerBorder: 'border-green-100',
        iconBg: 'bg-green-100 text-green-600',
        confirmBg: 'bg-green-600 hover:bg-green-700 text-white',
        confirmBgLoading: 'bg-green-400',
      }
    };

    return styles[variant] || styles.default;
  };

  // Get the appropriate icon based on iconType
  const getIcon = () => {
    if (customIcon) return customIcon;

    const icons = {
      alert: <AlertCircle size={24} />,
      warning: <AlertTriangle size={24} />,
      logout: <LogOut size={24} />,
      delete: <Trash2 size={24} />,
      save: <Save size={24} />,
      info: <Info size={24} />
    };

    return icons[iconType] || icons.alert;
  };

  // Get variant styles
  const styles = getVariantStyles();

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div 
        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleBackdropClick}
      >
        {/* Background overlay */}
        <motion.div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        ></motion.div>

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <motion.div 
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Modal header */}
          <div className={`py-3 px-4 ${styles.headerBg} border-b ${styles.headerBorder} flex justify-between items-center`}>
            <h3 className="text-lg font-medium text-gray-900" id="modal-title">
              {title}
            </h3>
            <button
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal content */}
          <div className="p-6">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                {getIcon()}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal actions */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium ${styles.confirmBg} ${isLoading ? styles.confirmBgLoading + ' cursor-not-allowed' : ''} focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : confirmText}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => (onCancel ? onCancel() : onClose())}
              disabled={isLoading}
            >
              {cancelText}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;