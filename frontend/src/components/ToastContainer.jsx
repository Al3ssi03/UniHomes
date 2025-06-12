import React, { useState, useEffect } from 'react';

let toastId = 0;

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Listener globale per i toast
    const handleAddToast = (event) => {
      const { message, type = 'info', duration = 3000 } = event.detail;
      const id = ++toastId;
      
      const newToast = {
        id,
        message,
        type,
        timestamp: Date.now()
      };

      setToasts(prev => [...prev, newToast]);

      // Auto rimozione
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    };

    window.addEventListener('addToast', handleAddToast);
    return () => window.removeEventListener('addToast', handleAddToast);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: getToastColor(toast.type),
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            pointerEvents: 'all',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '350px',
            animation: 'slideIn 0.3s ease-out'
          }}
          onClick={() => removeToast(toast.id)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{getToastIcon(toast.type)}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      ))}
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const getToastColor = (type) => {
  switch (type) {
    case 'success': return 'linear-gradient(135deg, #4CAF50, #45a049)';
    case 'error': return 'linear-gradient(135deg, #f44336, #d32f2f)';
    case 'warning': return 'linear-gradient(135deg, #ff9800, #f57c00)';
    default: return 'linear-gradient(135deg, #2196F3, #1976d2)';
  }
};

const getToastIcon = (type) => {
  switch (type) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    default: return 'ℹ️';
  }
};

// Funzione helper per mostrare toast
export const showToast = (message, type = 'info', duration = 3000) => {
  const event = new CustomEvent('addToast', {
    detail: { message, type, duration }
  });
  window.dispatchEvent(event);
};

export default ToastContainer;
