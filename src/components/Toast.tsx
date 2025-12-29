'use client';

import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }[type];

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
    >
      {message}
    </div>
  );
}

let toastContainer: HTMLDivElement | null = null;

function getOrCreateToastContainer(): HTMLDivElement {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-0 right-0 z-50 p-4';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message: string, type: ToastType = 'info', duration?: number) {
  const container = getOrCreateToastContainer();
  const wrapper = document.createElement('div');
  container.appendChild(wrapper);

  const root = createRoot(wrapper);
  root.render(
    <Toast
      message={message}
      type={type}
      duration={duration}
      onClose={() => {
        root.unmount();
        wrapper.remove();
      }}
    />,
  );
}
