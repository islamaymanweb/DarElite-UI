// register.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';
import { IdentityService } from '../../../core/services/identity-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private identityService = inject(IdentityService);
  private toast = inject(ToastService);
  private router = inject(Router);

  formGroup!: FormGroup;
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showEmailConfirmation = signal<boolean>(false);

  ngOnInit(): void {
    this.formValidation();
  }

  formValidation() {
    this.formGroup = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      DisplayName: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[0-9])(?=.*[#$@!.\-])[A-Za-z\d#$@!.\-]{8,}$/
          ),
        ],
      ],
      terms: [false, [Validators.requiredTrue]]
    });
  }

  get _username() {
    return this.formGroup.get('UserName');
  }

  get _email() {
    return this.formGroup.get('email');
  }

  get _DisplayName() {
    return this.formGroup.get('DisplayName');
  }

  get _password() {
    return this.formGroup.get('password');
  }

  get _terms() {
    return this.formGroup.get('terms');
  }

  Submit() {
    if (this.formGroup.valid) {
      this.isLoading.set(true);
      this.identityService.register(this.formGroup.value).subscribe({
        next: (value) => {
          console.log(value);
          this.showEmailConfirmation.set(true);
          this.isLoading.set(false);
          
          // Hide the confirmation message after 10 seconds
          setTimeout(() => {
            this.showEmailConfirmation.set(false);
          }, 10000);
        },
        error: (err: any) => {
          console.log(err);
          this.toast.error(err.error.message, 'Error');
          this.isLoading.set(false);
        },
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  getFormProgress(): number {
    const totalFields = 5;
    const validFields = [
      this._username?.valid,
      this._DisplayName?.valid,
      this._email?.valid,
      this._password?.valid,
      this._terms?.valid
    ].filter(Boolean).length;
    
    return Math.round((validFields / totalFields) * 100);
  }

  getPasswordStrength(): number {
    const password = this._password?.value;
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[#$@!.\-]/.test(password)) strength++;
    if (password.length >= 12) strength++;
    
    return strength;
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'Very Weak';
    }
  }
}