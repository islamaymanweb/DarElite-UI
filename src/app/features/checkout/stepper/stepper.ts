/* import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Address } from '../address/address';
import { DeliveryComponent } from '../delivery/delivery';
import { Payment } from '../payment/payment';

@Component({
  selector: 'app-stepper',
  imports: [CommonModule, 
    ReactiveFormsModule, 
    Address , 
    DeliveryComponent , 
    Payment ],
  templateUrl: './stepper.html',
  styleUrl: './stepper.scss',
})
export class Stepper {
    private fb = inject(FormBuilder);

  currentStep = signal<number>(1);
  steps = signal([
    { number: 1, title: 'Address', completed: false, active: true },
    { number: 2, title: 'Delivery', completed: false, active: false },
    { number: 3, title: 'Payment', completed: false, active: false }
  ]);

  addressForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    zipCode: ['', Validators.required],
    state: ['', Validators.required],
  });

  deliveryForm = this.fb.group({
    delivery: ['', Validators.required]
  });

  paymentForm = this.fb.group({
    nameOnCard: ['', Validators.required]
  });

  goToStep(stepNumber: number): void {
    if (stepNumber < 1 || stepNumber > 3) return;
    
    this.currentStep.set(stepNumber);
    this.updateStepsState(stepNumber);
  }

  nextStep(): void {
    if (this.currentStep() < 3) {
      this.currentStep.set(this.currentStep() + 1);
      this.updateStepsState(this.currentStep());
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
      this.updateStepsState(this.currentStep());
    }
  }

  private updateStepsState(currentStep: number): void {
    this.steps.update(steps => 
      steps.map(step => ({
        ...step,
        active: step.number === currentStep,
        completed: step.number < currentStep
      }))
    );
  }

  isStepValid(stepNumber: number): boolean {
    switch (stepNumber) {
      case 1:
        return this.addressForm.valid;
      case 2:
        return this.deliveryForm.valid;
      case 3:
        return this.paymentForm.valid;
      default:
        return false;
    }
  }
    getStepClass(step: any): string {
    if (step.active) return 'active';
    if (step.completed) return 'completed';
    return 'pending';
  }
} */
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Address } from '../address/address';
import { DeliveryComponent } from '../delivery/delivery';
import { Payment } from '../payment/payment';

@Component({
  selector: 'app-stepper',
  imports: [CommonModule, 
    ReactiveFormsModule, 
    Address, 
    DeliveryComponent, 
    Payment],
  templateUrl: './stepper.html',
  styleUrl: './stepper.scss',
})
export class Stepper {
  private fb = inject(FormBuilder);

  currentStep = signal<number>(1);
  steps = signal([
    { number: 1, title: 'Address', completed: false, active: true },
    { number: 2, title: 'Delivery', completed: false, active: false },
    { number: 3, title: 'Payment', completed: false, active: false }
  ]);

  addressForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    zipCode: ['', Validators.required],
    state: ['', Validators.required],
  });

  deliveryForm = this.fb.group({
    delivery: ['', Validators.required]
  });

  paymentForm = this.fb.group({
    nameOnCard: ['', Validators.required]
  });

  goToStep(stepNumber: number): void {
    if (stepNumber < 1 || stepNumber > 3) return;
    
    // منع الانتقال إذا كانت الخطوة الحالية غير مكتملة
    if (stepNumber > this.currentStep() && !this.isCurrentStepValid()) {
      return;
    }
    
    this.currentStep.set(stepNumber);
    this.updateStepsState(stepNumber);
  }

  nextStep(): void {
    // التحقق من صحة الخطوة الحالية قبل الانتقال
    if (this.currentStep() < 3 && this.isCurrentStepValid()) {
      this.markCurrentStepCompleted();
      this.currentStep.set(this.currentStep() + 1);
      this.updateStepsState(this.currentStep());
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
      this.updateStepsState(this.currentStep());
    }
  }

  private updateStepsState(currentStep: number): void {
    this.steps.update(steps => 
      steps.map(step => ({
        ...step,
        active: step.number === currentStep,
        completed: step.number < currentStep
      }))
    );
  }

  private markCurrentStepCompleted(): void {
    this.steps.update(steps => 
      steps.map(step => ({
        ...step,
        completed: step.number === this.currentStep() || step.completed
      }))
    );
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep()) {
      case 1:
        return this.addressForm.valid;
      case 2:
        return this.deliveryForm.valid;
      case 3:
        return this.paymentForm.valid;
      default:
        return false;
    }
  }

  isStepAccessible(stepNumber: number): boolean {
    // الخطوة متاحة فقط إذا كانت الخطوات السابقة مكتملة
    return stepNumber <= this.currentStep() || 
           (stepNumber > 1 && this.steps()[stepNumber - 2]?.completed);
  }

  getStepClass(step: any): string {
    if (step.active) return 'active';
    if (step.completed) return 'completed';
    if (!this.isStepAccessible(step.number)) return 'disabled';
    return 'pending';
  }
   getStepStatus(stepNumber: number): string {
    if (stepNumber === this.currentStep()) {
      return this.isCurrentStepValid() ? 'valid' : 'invalid';
    }
    return '';
  }
}