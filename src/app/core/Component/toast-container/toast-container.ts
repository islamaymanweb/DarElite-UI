// toast-container.component.ts
import { Component, inject, OnInit } from '@angular/core';
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
  
  toasts = this.toastService.toasts$;
  
  private pausedToasts = new Set<string>();

  ngOnInit(): void {
    console.log('🍞 ToastContainer initialized');
    
    // Debug: log toast changes
    this.toasts().forEach(toast => {
      console.log('🍞 Initial toast:', toast);
    });
  }

  removeToast(id: string): void {
    console.log('🍞 Container: Removing toast', id);
    this.toastService.remove(id);
    this.pausedToasts.delete(id);
  }

  pauseToast(id: string): void {
    console.log('🍞 Container: Pausing toast', id);
    this.pausedToasts.add(id);
  }

  resumeToast(id: string): void {
    console.log('🍞 Container: Resuming toast', id);
    this.pausedToasts.delete(id);
  }

  // Debug method
  debugToasts(): void {
    console.log('🍞 Current toasts:', this.toasts());
    console.log('🍞 Paused toasts:', Array.from(this.pausedToasts));
  }
}