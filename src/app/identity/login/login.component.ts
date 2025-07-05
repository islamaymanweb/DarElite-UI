import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentityService } from '../identity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../../core/core.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string = '/';
  isLoading: boolean = false;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private identityService: IdentityService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private coreService: CoreService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.identityService.login(loginData).pipe(
      catchError(error => {
        this.isLoading = false;
        this.loginError = error.error?.message || 'Invalid email or password';
        return throwError(() => error);
      })
    ).subscribe({
      next: (response) => {
        this.handleLoginSuccess(response);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private handleLoginSuccess(response: any): void {
    this.isLoading = false;
    
    if (response.token && isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', response.token);
      this.coreService.checkLoginStatus();
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  togglePasswordVisibility(): void {
    const passwordField = document.getElementById('password') as HTMLInputElement;
    const icon = document.querySelector('.toggle-password');
    
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      icon?.classList.remove('fa-eye');
      icon?.classList.add('fa-eye-slash');
    } else {
      passwordField.type = 'password';
      icon?.classList.remove('fa-eye-slash');
      icon?.classList.add('fa-eye');
    }
  }
} 
