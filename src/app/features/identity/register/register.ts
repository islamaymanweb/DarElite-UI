// register.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';
import { IdentityService } from '../../../core/services/identity-service';
import { RegisterDTO, ResponseAPI } from '../../../core/models/login';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {
  private fb = inject(NonNullableFormBuilder);
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
      UserName: this.fb.control<string>('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      email: this.fb.control<string>('', [
        Validators.required,
        Validators.email,
      ]),
      DisplayName: this.fb.control<string>('', [Validators.required]),
      password: this.fb.control<string>('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[0-9])(?=.*[#$@!.\-])[A-Za-z\d#$@!.\-]{8,}$/
        ),
      ]),
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

 

  Submit() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.formGroup.getRawValue();
    const payload: RegisterDTO = {
      email: formValue.email,
      password: formValue.password,
      userName: formValue.UserName,
      displayName: formValue.DisplayName,
    };

    this.identityService.register(payload).subscribe({
      next: (res: ResponseAPI) => {
        console.log('Register response', res);

        if (res.statusCode === 200) {
          this.toast.success('Registration successful', 'Success');
          this.showEmailConfirmation.set(true);

          // Hide the confirmation message after 10 seconds
          setTimeout(() => {
            this.showEmailConfirmation.set(false);
          }, 10000);

          // Optional: redirect to login
          // this.router.navigate(['/Account/Login']);
        } else {
          this.toast.error(res.message, 'Error');
        }

        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.log('Register error', err);
        const msg =
          err?.error?.message ||
          err?.error?.Message ||
          err?.message ||
          'Registration failed';
        this.toast.error(msg, 'Error');
        this.isLoading.set(false);
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  getFormProgress(): number {
    const totalFields = 4;
    const validFields = [
      this._username?.valid,
      this._DisplayName?.valid,
      this._email?.valid,
      this._password?.valid
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