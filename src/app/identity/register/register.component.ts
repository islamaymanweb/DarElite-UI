import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentityService } from '../identity.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _service: IdentityService,
    private toast: ToastrService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.formValidation();
  }

  formValidation() {
    this.formGroup = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      DisplayName: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[0-9])(?=.*[#$@!.\-])[A-Za-z\d#$@!.\-]{8,}$/)
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

  submit() {
    if (this.formGroup.valid) {
      this._service.register(this.formGroup.value).subscribe({
        next: (value) => {
          this.toast.success("Registration successful", 'SUCCESS');
          this.route.navigateByUrl('/Account/Login');
        },
        error: (err: any) => {
          const errorMessage = err.error?.message || 'Registration failed. Please try again.';
          this.toast.error(errorMessage, 'ERROR');
        },
      });
    }
  }

  togglePasswordVisibility() {
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