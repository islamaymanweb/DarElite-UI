import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
 
import { ToastService } from '../../../core/services/toast-service';
import { AdminService } from '../../../core/services/admin-service';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-admin.html',
  styleUrls: ['./add-admin.scss']
})
export class AddAdmin implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private toast = inject(ToastService);
  private router = inject(Router);

  formGroup!: FormGroup;
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword?.setErrors(null);
      return null;
    }
  }

  get _email() {
    return this.formGroup.get('email');
  }

  get _firstName() {
    return this.formGroup.get('firstName');
  }

  get _lastName() {
    return this.formGroup.get('lastName');
  }

  get _password() {
    return this.formGroup.get('password');
  }

  get _confirmPassword() {
    return this.formGroup.get('confirmPassword');
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit(): void {
    if (this.formGroup.valid && !this.isLoading()) {
      this.isLoading.set(true);

      const adminData = {
        email: this.formGroup.value.email,
        firstName: this.formGroup.value.firstName,
        lastName: this.formGroup.value.lastName,
        password: this.formGroup.value.password
      };

      this.adminService.addAdmin(adminData).subscribe({
        next: (response) => {
          this.toast.success('Admin Added', response.message || 'The admin has been added successfully');
          this.router.navigate(['/admin']);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error adding admin:', error);
          let errorMessage = 'Failed to add admin';
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
          this.toast.error('Failed to Add Admin', errorMessage);
          this.isLoading.set(false);
        }
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}

