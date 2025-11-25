import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActiveAccount } from '../models/ActiveAccount';
import { ResetPassword } from '../models/ResetPassword';
 
@Injectable({
  providedIn: 'root'
})
export class IdentityService {
   private http = inject(HttpClient);
  
  baseURL = environment.baseURL;

  register(form: any) {
    return this.http.post(this.baseURL + "Account/Register", form);
  }

  active(param: ActiveAccount) {
    return this.http.post(this.baseURL + "Account/active-account", param);
  }

  Login(form: any) {
    return this.http.post(this.baseURL + "Account/Login", form);
  }

  forgetPassword(email: string) {
    return this.http.get(this.baseURL + `Account/send-email-forget-password?email=${email}`);
  }

  ResetPassword(param: ResetPassword) {
    return this.http.post(this.baseURL + "Account/reset-password", param);
  }
}