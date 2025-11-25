import { Component, Input, OnInit, OnDestroy, output, signal } from '@angular/core';
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
  mouseEnter = output<void>();
  mouseLeave = output<void>();

  private progressInterval: any;
  progress = signal<number>(100);
  private elapsed = 0;

  get progressWidth(): string {
    return `${this.progress()}%`;
  }

  get iconPath(): string {
    const icons = {
      success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c.54 0 .98-.436.937-.976l-.75-8.974a.937.937 0 00-.937-.898H4.687a.937.937 0 00-.937.898l-.75 8.974c-.042.54.398.976.937.976z',
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return icons[this.toast.type];
  }

  get iconColor(): string {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    return colors[this.toast.type];
  }

  ngOnInit(): void {
    if (this.toast.autoClose && this.toast.duration) {
      this.startProgressBar();
    }
  }

  private startProgressBar(): void {
    const interval = 50;
    const totalSteps = this.toast.duration! / interval;
    const step = 100 / totalSteps;

    this.progressInterval = setInterval(() => {
      this.elapsed += interval;
      const newProgress = 100 - (this.elapsed / this.toast.duration!) * 100;
      this.progress.set(Math.max(0, newProgress));

      if (this.elapsed >= this.toast.duration!) {
        this.close();
      }
    }, interval);
  }
  
  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  onMouseEnter(): void {
    this.mouseEnter.emit();
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  onMouseLeave(): void {
    this.mouseLeave.emit();
    if (this.toast.autoClose) {
      this.startProgressBar();
    }
  }

  close(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this.closed.emit();
  }
}