import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActiveAccount } from '../models/ActiveAccount';
import { ResetPassword } from '../models/ResetPassword';
import {
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  ActiveAccountDTO,
  ResponseAPI,
} from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private http = inject(HttpClient);

  baseURL = environment.baseURL;

  register(form: RegisterDTO) {
    return this.http.post<ResponseAPI>(this.baseURL + 'Account/Register', form);
  }

  active(param: ActiveAccountDTO) {
    return this.http.post<ResponseAPI>(
      this.baseURL + 'Account/active-account',
      param
    );
  }

  Login(form: LoginDTO) {
    return this.http.post<ResponseAPI>(this.baseURL + 'Account/Login', form);
  }

  forgetPassword(email: string) {
    return this.http.get<ResponseAPI>(
      this.baseURL + `Account/send-email-forget-password?email=${email}`
    );
  }

  ResetPassword(param: ResetPasswordDTO) {
    return this.http.post<ResponseAPI>(
      this.baseURL + 'Account/reset-password',
      param
    );
  }
}