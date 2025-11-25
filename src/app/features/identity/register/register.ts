import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';
import { IdentityService } from '../../../core/services/identity-service';
 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl:'./register.html' ,
  styleUrls: ['./register.scss']
})
/* export class Register  implements OnInit {
  private fb = inject(FormBuilder);
  private identityService = inject(IdentityService);
  private toast = inject(ToastService);
  private router = inject(Router);

  formGroup!: FormGroup;

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
  if (this.formGroup.valid) {
    this.isLoading.set(true);
    this.identityService.register(this.formGroup.value).subscribe({
      next: (value) => {
        console.log(value);
        this.toast.success("Register success", "Please confirm your email");
        this.router.navigateByUrl('/Account/Login');
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.log(err);
        this.toast.error(err.error.message, 'Error');
        this.isLoading.set(false);
      },
    });
  }
}
  // Add these signals
isLoading = signal<boolean>(false);

// Add these helper methods
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

// Update Submit method

} */
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private identityService = inject(IdentityService);
  private toast = inject(ToastService);
  private router = inject(Router);

  formGroup!: FormGroup;
  isLoading = false;

  ngOnInit(): void {
    this.formValidation();
  }

  formValidation() {
    this.formGroup = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[0-9])(?=.*[#$@!.\-])[A-Za-z\d#$@!.\-]{8,}$/
          ),
        ],
      ],
    });
  }

  get _userName() {
    return this.formGroup.get('userName');
  }

  get _email() {
    return this.formGroup.get('email');
  }

  get _displayName() {
    return this.formGroup.get('displayName');
  }

  get _password() {
    return this.formGroup.get('password');
  }

  // Password validation helper methods
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

  // Password strength methods
  getPasswordStrength(): number {
    const password = this._password?.value;
    if (!password) return 0;
    
    let strength = 0;
    if (this.hasMinLength()) strength += 25;
    if (this.hasNumber()) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (this.hasSpecialChar()) strength += 25;
    
    return Math.min(strength, 100);
  }

  getPasswordStrengthClass(level: number): string {
    const strength = this.getPasswordStrength();
    const strengthLevel = Math.floor(strength / 25);
    
    if (level <= strengthLevel) {
      switch (strengthLevel) {
        case 1: return 'strength-bar weak';
        case 2: return 'strength-bar medium';
        case 3: return 'strength-bar strong';
        case 4: return 'strength-bar very-strong';
        default: return 'strength-bar';
      }
    }
    return 'strength-bar';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 25) return 'Very Weak';
    if (strength <= 50) return 'Weak';
    if (strength <= 75) return 'Good';
    return 'Strong';
  }

  Submit() {
    if (this.formGroup.valid && !this.isLoading) {
      this.isLoading = true;

      // تحضير البيانات بشكل صحيح
      const formData = {
        userName: this.formGroup.value.userName,
        email: this.formGroup.value.email,
        displayName: this.formGroup.value.displayName,
        password: this.formGroup.value.password
      };

      console.log('Sending registration data:', formData);

      this.identityService.register(formData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.toast.success(
            "Registration Successful", 
            "Please check your email to activate your account. We've sent you an activation link."
          );
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 2000);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Registration error:', error);
          
          let errorMessage = 'Registration failed';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status === 400) {
            errorMessage = 'Invalid data provided. Please check your information.';
          }
          
          this.toast.error("Registration Failed", errorMessage);
          this.isLoading = false;
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.formGroup.markAllAsTouched();
    }
  }
}