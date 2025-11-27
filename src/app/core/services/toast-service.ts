 
import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);

  // Public signal for components to read
  toasts$ = this.toasts.asReadonly();

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private addToast(toast: Omit<Toast, 'id'>): void {
    const newToast: Toast = {
      ...toast,
      id: this.generateId(),
      duration: toast.duration ?? 5000 // Default 5 seconds
    };

    this.toasts.update(toasts => [...toasts, newToast]);
    
    console.log('🍞 Toast added:', newToast);
  }

  // Public methods
  success(title: string, message?: string, duration?: number): void {
    this.addToast({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, duration?: number): void {
    this.addToast({ type: 'error', title, message, duration });
  }

  warning(title: string, message?: string, duration?: number): void {
    this.addToast({ type: 'warning', title, message, duration });
  }

  info(title: string, message?: string, duration?: number): void {
    this.addToast({ type: 'info', title, message, duration });
  }

  remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
    console.log('🍞 Toast removed:', id);
  }

  clear(): void {
    this.toasts.set([]);
    console.log('🍞 All toasts cleared');
  }

  // Get current toasts for debugging
  getCurrentToasts(): Toast[] {
    return this.toasts();
  }
}