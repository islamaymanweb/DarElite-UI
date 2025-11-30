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
hasExistingAddress = signal<boolean>(false);
  @Input() addressForm!: FormGroup;
  @Output() next = new EventEmitter<void>();

  canEdit = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadAddress();
  }

/*   loadAddress(): void {
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
  } */

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

 /*  onNext(): void {
    if (this.addressForm.valid) {
      this.next.emit();
    }
  } */
loadAddress(): void {
  this.checkoutService.getAddress().subscribe({
    next: (address: any) => {
      if (address) {
        this.addressForm.patchValue(address);
        this.hasExistingAddress.set(this.hasAddressData());
      }
      this.isLoading.set(false);
    }
  });
}

hasAddressData(): boolean {
  const addressFields = ['street', 'city', 'state', 'zipCode'];
  return addressFields.some(field => {
    const value = this.addressForm.get(field)?.value;
    return value && value.trim() !== '';
  });
}

/* // دالة للتحقق من وجود بيانات العنوان
private hasAddressData(): boolean {
    const address = this.addressForm.value;
    return !!(address.street && address.city && address.state && address.zipCode);
} */
// حفظ العنوان للمستخدم الجديد
saveNewAddress(): void {
    if (this.addressForm.valid) {
        this.checkoutService.updateAddress(this.addressForm.value).subscribe({
            next: (response) => {
                console.log('New address saved successfully:', response);
                this.hasExistingAddress.set(true);
                this.canEdit.set(false);
                this.onNext(); // الانتقال تلقائياً للخطوة التالية
            },
            error: (error) => {
                console.error('Error saving new address:', error);
            }
        });
    }
}
saveAndContinue(): void {
    if (this.addressForm.valid) {
      this.checkoutService.updateAddress(this.addressForm.value).subscribe({
        next: (response) => {
          this.hasExistingAddress.set(true);
          this.canEdit.set(false);
          this.next.emit();
        },
        error: (error) => {
          console.error('Error saving address:', error);
        }
      });
    }
  }
// تحسين دالة onNext
onNext(): void {
    if (this.addressForm.valid) {
        // إذا كان مستخدم جديد ولا يملك عنوان، احفظ أولاً
        if (!this.hasExistingAddress()) {
            this.saveNewAddress();
        } else {
            this.next.emit();
        }
    }
}
}  
 /* import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
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
  hasExistingAddress = signal<boolean>(false);

  ngOnInit(): void {
    this.loadAddress();
  }

  loadAddress(): void {
    this.checkoutService.getAddress().subscribe({
      next: (address: any) => {
        if (address) {
          this.addressForm.patchValue(address);
          this.checkExistingAddress();
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading address:', error);
        this.isLoading.set(false);
      }
    });
  }

  // التحقق مما إذا كان المستخدم لديه عنوان موجود مسبقاً
  checkExistingAddress(): void {
    const addressFields = ['street', 'city', 'state', 'zipCode'];
    const hasData = addressFields.some(field => {
      const value = this.addressForm.get(field)?.value;
      return value && value.toString().trim() !== '';
    });
    this.hasExistingAddress.set(hasData);
    
    // إذا كان مستخدم جديد، اسمح له بالتعديل مباشرة
    if (!hasData) {
      this.canEdit.set(true);
    }
  }

  updateAddress(): void {
    if (this.addressForm.valid) {
      this.checkoutService.updateAddress(this.addressForm.value).subscribe({
        next: (response) => {
          console.log('Address updated successfully:', response);
          this.canEdit.set(false);
          this.hasExistingAddress.set(true);
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
}  */