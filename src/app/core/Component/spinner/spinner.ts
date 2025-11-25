import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class Spinner {
     private loadingService = inject(LoadingService);
  
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: 'primary' | 'secondary' | 'white' = 'primary';
  @Input() text: string = 'Loading...';
  @Input() overlay: boolean = true;
  @Input() global: boolean = false;  

  isLoading = this.loadingService.isLoading;
 
  shouldShow(): boolean {
    return this.global ? this.isLoading() : true;
  }
}
