import React, { useState } from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';

  return (
    <div className={`${bgColor} border-l-4 ${borderColor} p-4 mb-4`} role="alert">
      <p className={`font-bold ${textColor}`}>{type === 'success' ? 'Success' : 'Error'}</p>
      <p className={textColor}>{message}</p>
      <button
        onClick={handleClose}
        className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-900"
        aria-label="close"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Alert;