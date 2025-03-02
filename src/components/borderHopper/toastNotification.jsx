// src/components/borderHopper/toastNotification.jsx
import React, { useEffect } from 'react';

const ToastNotification = ({ message, isError = false, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 
                  ${isError ? 'bg-red-500' : 'bg-green-500'} 
                  text-white px-6 py-3 rounded-lg shadow-lg
                  flex items-center space-x-2 z-50`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
};

export default ToastNotification;