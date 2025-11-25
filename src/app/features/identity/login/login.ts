 
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IdentityService } from '../../../core/services/identity-service';
import { CoreService } from '../../../core/services/core-service';
import { ToastService } from '../../../core/services/toast-service';
 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
/* export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private identityService = inject(IdentityService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private coreService = inject(CoreService);
 
isLoading = signal<boolean>(false);
 
  formGroup!: FormGroup;
  emailModel = signal<string>('');
  returnUrl = signal<string>('/');

  ngOnInit(): void {
    this.FormValidation();
    
    this.route.queryParams.subscribe(param => {
      this.returnUrl.set(param["returnUrl"] || '/');
    });
  }

  FormValidation() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

  get _email() {
    return this.formGroup.get('email');
  }

  get _password() {
    return this.formGroup.get('password');
  }

Submit() {
  if (this.formGroup.valid) {
    this.isLoading.set(true);
    this.identityService.Login(this.formGroup.value).subscribe({
      next: (value) => {
        this.coreService.getUserName().subscribe();
        console.log(value);
        this.router.navigateByUrl(this.returnUrl());
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }
}

SendEmailForgetpassword() {
  if (this.emailModel()) {
    this.identityService.forgetPassword(this.emailModel()).subscribe({
      next: (value) => {
        console.log(value);
        this.closeForgotPasswordModal();
        
      },
      error: (err) => {
        console.log(err);
       
      },
    });
  }
}
 
showForgotPasswordModal = signal<boolean>(false);

openForgotPasswordModal() {
  this.showForgotPasswordModal.set(true);
}

closeForgotPasswordModal() {
  this.showForgotPasswordModal.set(false);
  this.emailModel.set('');
}

} */
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private identityService = inject(IdentityService);
  private coreService = inject(CoreService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formGroup!: FormGroup;
  emailModel = signal<string>('');
  returnUrl = signal<string>('/');
  isLoading = signal<boolean>(false);
  showForgotPasswordModal = signal<boolean>(false);

  ngOnInit(): void {
    this.FormValidation();
    
    this.route.queryParams.subscribe(param => {
      this.returnUrl.set(param["returnUrl"] || '/');
    });
  }

  FormValidation() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get _email() {
    return this.formGroup.get('email');
  }

  get _password() {
    return this.formGroup.get('password');
  }

  Submit() {
    if (this.formGroup.valid && !this.isLoading()) {
      this.isLoading.set(true);

      this.coreService.login(this.formGroup.value).subscribe({
        next: (response) => {
          this.toast.success('Welcome back!', 'Login successful');
          this.router.navigateByUrl(this.returnUrl());
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Login error:', error);
          
          let errorMessage = 'Login failed. Please check your credentials.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = 'Invalid email or password.';
          } else if (error.status === 400) {
            errorMessage = 'Please check your input data.';
          }
          
          this.toast.error('Login Failed', errorMessage);
          this.isLoading.set(false);
        },
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  SendEmailForgetpassword() {
    if (!this.emailModel()) {
      this.toast.warning('Email required', 'Please enter your email address');
      return;
    }

    this.identityService.forgetPassword(this.emailModel()).subscribe({
      next: (value) => {
        this.toast.success('Reset email sent', 'Check your inbox for instructions');
        this.closeForgotPasswordModal();
      },
      error: (err) => {
        console.error('Forgot password error:', err);
        this.toast.error('Failed to send email', 'Please try again later');
      },
    });
  }

  openForgotPasswordModal() {
    this.showForgotPasswordModal.set(true);
  }

  closeForgotPasswordModal() {
    this.showForgotPasswordModal.set(false);
    this.emailModel.set('');
  }
}