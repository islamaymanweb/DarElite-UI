import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout-service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address.html',
  styleUrl: './address.scss',
})
export class Address implements OnInit {
  private checkoutService = inject(CheckoutService);

  @Input() addressForm!: FormGroup;
  @Output() next = new EventEmitter<void>();

  canEdit = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadAddress();
  }

  loadAddress(): void {
    this.checkoutService.getAddress().subscribe({
      next: (address: any) => {
        this.addressForm.patchValue(address);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading address:', error);
        this.isLoading.set(false);
      }
    });
  }

  updateAddress(): void {
    if (this.addressForm.valid) {
      this.checkoutService.updateAddress(this.addressForm.value).subscribe({
        next: (response) => {
          console.log('Address updated successfully:', response);
          this.canEdit.set(false);
        },
        error: (error) => {
          console.error('Error updating address:', error);
        }
      });
    }
  }

  toggleEdit(): void {
    this.canEdit.set(!this.canEdit());
  }

  onNext(): void {
    if (this.addressForm.valid) {
      this.next.emit();
    }
  }
}