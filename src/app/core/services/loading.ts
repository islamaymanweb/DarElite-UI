import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingState = signal<boolean>(false);
  private requestCount = 0;

  isLoading = this.loadingState.asReadonly();

  showLoading(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingState.set(true);
    }
  }

  hideLoading(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingState.set(false);
    }
  }
}