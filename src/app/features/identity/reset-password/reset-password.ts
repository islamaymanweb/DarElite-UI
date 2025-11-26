// reset-password.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IdentityService } from '../../../core/services/identity-service';
import { ToastService } from '../../../core/services/toast-service';
import { ResetPasswordDTO, ResponseAPI } from '../../../core/models/login';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss']
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private identityService = inject(IdentityService);
  private toast = inject(ToastService);
  private router = inject(Router);

  formGroup!: FormGroup;
  email = signal<string>('');
  token = signal<string>('');
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  resetSuccess = signal<boolean>(false);

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.email.set(param['email'] || '');
      this.token.set(param['code'] || '');
    });
    this.formValidation();
  }

  formValidation() {
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
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  }

  get _password() {
    return this.formGroup.get('password');
  }

  get _confirmPassword() {
    return this.formGroup.get('confirmPassword');
  }

  Submit() {
    if (this.formGroup.valid && !this.isLoading()) {
      this.isLoading.set(true);

      const payload: ResetPasswordDTO = {
        email: this.email(),
        token: this.token(),
        password: this.formGroup.value.password
      };

      this.identityService.ResetPassword(payload).subscribe({
        next: (res: ResponseAPI) => {
          console.log('Reset password response', res);

          if (res.statusCode === 200) {
            this.resetSuccess.set(true);
            this.toast.success('Password Reset Successful', 'You can now sign in with your new password');
            
            setTimeout(() => {
              this.router.navigate(['/Account/Login'], {
                queryParams: { email: this.email() }
              });
            }, 3000);
          } else {
            this.toast.error(res.message, 'Error');
          }

          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.log('Reset password error', err);
          const msg = err?.error?.message || err?.error?.Message || err?.message || 'Password reset failed';
          this.toast.error(msg, 'Error');
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

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
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