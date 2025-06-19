
import React, { useState, useEffect } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  useEffect(() => {
    toasts.forEach(toast => {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 4000);
      return () => clearTimeout(timer);
    });
  }, [toasts, removeToast]);

  const getToastStyles = (type: string) => {
    const baseStyles = "fixed top-4 right-4 p-4 rounded-2xl backdrop-blur-xl shadow-2xl transform transition-all duration-500 ease-out max-w-sm z-50";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500/90 text-white shadow-green-500/30`;
      case 'error':
        return `${baseStyles} bg-red-500/90 text-white shadow-red-500/30`;
      case 'warning':
        return `${baseStyles} bg-yellow-500/90 text-white shadow-yellow-500/30`;
      default:
        return `${baseStyles} bg-blue-500/90 text-white shadow-blue-500/30`;
    }
  };

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} animate-in slide-in-from-right-full`}
          style={{
            animationDelay: `${index * 100}ms`,
            transform: `translateY(${index * 70}px)`
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-light">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-white/80 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};
