import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IdentityService } from '../../../core/services/identity-service';
import { ResetPassword } from '../../../core/models/ResetPassword';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss']
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private identityService = inject(IdentityService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  formGroup!: FormGroup;
  ResetValue = new ResetPassword();
  
  // Add signals
  isLoading = signal<boolean>(false);
  showSuccess = signal<boolean>(false);

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.ResetValue.email = param['email'];
      this.ResetValue.token = param['code'];
    });
    this.FormValidation();
  }

  FormValidation() {
    this.formGroup = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[0-9])(?=.*[#$@!.\-])[A-Za-z\d#$@!.\-]{8,}$/
          ),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[0-9])(?=.*[#$@!.\-])[A-Za-z\d#$@!.\-]{8,}$/
          ),
        ],
      ],
    },
    { validators: this.PasswordMatchValidation }
    );
  }

  PasswordMatchValidation(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get _password() {
    return this.formGroup.get('password');
  }

  get _confirmPassword() {
    return this.formGroup.get('confirmPassword');
  }

  // Helper methods for template
  hasMinLength(): boolean {
    const password = this._password?.value;
    return password && password.length >= 8;
  }

  hasNumber(): boolean {
    const password = this._password?.value;
    return password && /[0-9]/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this._password?.value;
    return password && /[#$@!.\-]/.test(password);
  }

  passwordsMatch(): boolean {
    return this._password?.value === this._confirmPassword?.value && !!this._confirmPassword?.value;
  }

  // Password strength methods
  getPasswordStrength(): number {
    const password = this._password?.value;
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[#$@!.\-]/.test(password)) strength += 25;
    
    return Math.min(strength, 100);
  }

  getPasswordStrengthClass(level: number): string {
    const strength = this.getPasswordStrength();
    const strengthLevel = Math.floor(strength / 25);
    
    if (level <= strengthLevel) {
      switch (strengthLevel) {
        case 1: return 'weak';
        case 2: return 'medium';
        case 3: return 'strong';
        case 4: return 'very-strong';
        default: return '';
      }
    }
    return '';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 25) return 'Very Weak';
    if (strength <= 50) return 'Weak';
    if (strength <= 75) return 'Good';
    return 'Strong';
  }

  Submit() {
    if (this.formGroup.valid) {
      this.isLoading.set(true);
      this.ResetValue.password = this.formGroup.value.password;
      this.identityService.ResetPassword(this.ResetValue).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.showSuccess.set(true);
          this.toastService.success(
            'Password Reset Successful', 
            'Your password has been reset successfully. You can now login with your new password.'
          );
          // Redirect automatically after 3 seconds
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 3000);
        },
        error: (err) => {
          console.error('Reset password error:', err);
          this.isLoading.set(false);
          
          let errorMessage = 'Failed to reset password. Please try again.';
          if (err.error && err.error.message) {
            errorMessage = err.error.message;
          } else if (err.status === 400) {
            errorMessage = 'Invalid or expired reset link. Please request a new one.';
          }
          
          this.toastService.error('Reset Failed', errorMessage);
        },
      });
    }
  }
}