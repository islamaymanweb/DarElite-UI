/* // toast.component.ts
import { Component, Input, OnInit, OnDestroy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from '../../services/toast-service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input({ required: true }) toast!: Toast;
  
  closed = output<void>();

  private autoCloseTimeout: any;
  private progressInterval: any;
  progressValue = 100;
  private isPaused = false;
  private startTime = Date.now();
  private remainingTime = 0;

  ngOnInit(): void {
    if (this.toast.autoClose && this.toast.duration) {
      this.startAutoClose();
      this.startProgressBar();
    }
  }

  private startAutoClose(): void {
    this.remainingTime = this.toast.duration!;
    this.autoCloseTimeout = setTimeout(() => {
      this.close();
    }, this.remainingTime);
  }

  private startProgressBar(): void {
    const interval = 50;
    const totalSteps = this.toast.duration! / interval;
    const step = 100 / totalSteps;

    this.progressInterval = setInterval(() => {
      if (!this.isPaused) {
        this.progressValue -= step;
        
        if (this.progressValue <= 0) {
          this.clearTimers();
        }
      }
    }, interval);
  }

  private clearTimers(): void {
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  onMouseEnter(): void {
    this.isPaused = true;
    this.clearTimers();
    
    // حساب الوقت المتبقي
    const elapsed = Date.now() - this.startTime;
    this.remainingTime = this.toast.duration! - elapsed;
  }

  onMouseLeave(): void {
    this.isPaused = false;
    this.startTime = Date.now();
    
    if (this.remainingTime > 0) {
      // إعادة تشغيل الـ auto close
      this.autoCloseTimeout = setTimeout(() => {
        this.close();
      }, this.remainingTime);

      // إعادة تشغيل progress bar
      this.startProgressBarFromCurrent();
    }
  }

  private startProgressBarFromCurrent(): void {
    const interval = 50;
    const remainingSteps = this.remainingTime / interval;
    const step = this.progressValue / remainingSteps;

    this.progressInterval = setInterval(() => {
      if (!this.isPaused) {
        this.progressValue -= step;
        
        if (this.progressValue <= 0) {
          this.clearTimers();
        }
      }
    }, interval);
  }

  close(): void {
    this.clearTimers();
    this.closed.emit();
  }
} */
// toast.component.ts
 // toast.component.ts
import { Component, input, output, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  toast = input.required<Toast>();
  closed = output<string>();
  mouseEnter = output<string>();
  mouseLeave = output<string>();

  isExiting = signal(false);
  isPaused = signal(false);
  private timerId: any;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  private startTimer() {
    const duration = this.toast().duration || 5000;
    
    if (duration > 0) {
      this.timerId = setTimeout(() => {
        this.close();
      }, duration);
    }
  }

  private clearTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  close() {
    if (!this.isExiting()) {
      this.isExiting.set(true);
      
      // Wait for exit animation to complete
      setTimeout(() => {
        this.closed.emit(this.toast().id);
      }, 300); // Match this with CSS animation duration
    }
  }

  onMouseEnter() {
    this.isPaused.set(true);
    this.clearTimer();
    this.mouseEnter.emit(this.toast().id);
  }

  onMouseLeave() {
    this.isPaused.set(false);
    this.startTimer();
    this.mouseLeave.emit(this.toast().id);
  }
}