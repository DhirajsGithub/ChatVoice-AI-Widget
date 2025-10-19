import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: 10000,
      maxWidth: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    };

    switch (type) {
      case 'error':
        return { ...baseStyles, backgroundColor: '#ff4444' };
      case 'success':
        return { ...baseStyles, backgroundColor: '#4CAF50' };
      case 'warning':
        return { ...baseStyles, backgroundColor: '#ff9800' };
      case 'info':
        return { ...baseStyles, backgroundColor: '#2196F3' };
      default:
        return { ...baseStyles, backgroundColor: '#666' };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div style={getToastStyles()}>
      <span style={{ fontSize: '16px' }}>{getIcon()}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0',
          marginLeft: '8px'
        }}
      >
        ×
      </button>
    </div>
  );
};
