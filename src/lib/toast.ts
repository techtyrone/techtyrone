// src/lib/toast.ts - Simple toast implementation
// Use this if react-hot-toast installation fails

interface ToastOptions {
  duration?: number;
  type?: 'success' | 'error' | 'info';
}

class SimpleToast {
  private container: HTMLElement | null = null;

  private getContainer(): HTMLElement {
    if (!this.container) {
      this.container = document.getElementById('toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(this.container);
      }
    }
    return this.container;
  }

  private show(message: string, options: ToastOptions = {}) {
    const { duration = 4000, type = 'info' } = options;
    const container = this.getContainer();

    const toast = document.createElement('div');
    toast.className = `
      p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ease-in-out translate-x-full
      ${type === 'success' ? 'bg-green-500 text-white' : ''}
      ${type === 'error' ? 'bg-red-500 text-white' : ''}
      ${type === 'info' ? 'bg-blue-500 text-white' : ''}
    `;
    toast.textContent = message;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Remove after duration
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  success(message: string, options?: ToastOptions) {
    this.show(message, { ...options, type: 'success' });
  }

  error(message: string, options?: ToastOptions) {
    this.show(message, { ...options, type: 'error' });
  }

  info(message: string, options?: ToastOptions) {
    this.show(message, { ...options, type: 'info' });
  }
}

export const toast = new SimpleToast();

// Alternative: If you prefer to use react-hot-toast but it fails to install
// export { toast } from 'react-hot-toast';