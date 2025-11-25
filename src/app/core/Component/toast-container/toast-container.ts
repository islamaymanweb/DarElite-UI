import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from '../../services/toast-service';
 
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="toast-container">
      @for (toast of toasts(); track toast.id) {
        <app-toast
          [toast]="toast"
          (closed)="removeToast(toast.id)"
          (mouseEnter)="pauseToast(toast.id)"
          (mouseLeave)="resumeToast(toast.id)"
        />
      }
    </div>
  `,
  styleUrls: ['./toast-container.scss']
})
export class ToastContainer implements OnInit {
  private toastService = inject(ToastService);
  
  // Use signal directly from service - this should work in template
  toasts = this.toastService.toasts$;
  
  constructor() {
    console.log('🍞 ToastContainer constructor - initialized');
    
    // Track toasts changes
    effect(() => {
      const currentToasts = this.toasts();
      console.log('🍞 Toasts changed in container (effect):', currentToasts.length, currentToasts);
    });
  }
  
  ngOnInit(): void {
    console.log('🍞 ToastContainer ngOnInit, current toasts:', this.toasts().length);
    
    // Test toast to verify system works
    setTimeout(() => {
      console.log('🍞 Testing toast system...');
      this.toastService.success('Toast System Test', 'If you see this, toast notifications are working!');
    }, 1000);
  }

  removeToast(id: string): void {
    console.log('🍞 Removing toast:', id);
    this.toastService.remove(id);
  }

  pauseToast(id: string): void {
    console.log('🍞 Pausing toast:', id);
  }

  resumeToast(id: string): void {
    console.log('🍞 Resuming toast');
  }
}