import { create } from 'zustand';
import type { ToastNotification } from '../types/contracts';

/**
 * Toast Store - Notification message management
 * 
 * Responsibilities:
 * - Manage all toast notifications in the application
 * - Automatically handle notification display and removal
 * - Support different types of notifications (success, error, info, warning)
 */
interface ToastStore {
  // State
  toasts: ToastNotification[];

  // Actions
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  // Initial state
  toasts: [],

  /**
   * Add a new toast notification
   * 
   * Automatically generate unique ID and auto-remove after specified duration
   */
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastNotification = { id, ...toast };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove toast after duration
    const duration = toast.duration ?? 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  /**
   * Remove a specific toast notification
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
