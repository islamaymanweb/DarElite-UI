import { environment } from './../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

interface LoginResponse {
  statusCode: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  baseURL = environment.baseURL;
  
  constructor(private http: HttpClient) { }

  register(form: any): Observable<any> {
    return this.http.post(this.baseURL + "Account/Register", form).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

/*   login(credentials: { email: string, password: string }) {
    return this.http.post(this.baseURL + 'Login', credentials).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  } */
 
login(credentials: { email: string, password: string }) {
  return this.http.post<LoginResponse>(this.baseURL + 'Account/Login', credentials, {
    withCredentials: true // لاستقبال الكوكيز
  }).pipe(
    catchError(error => {
      let errorMsg = 'An error occurred';
      if (error.status === 400) {
        errorMsg = error.error?.message || 'Invalid credentials';
      }
      return throwError(() => new Error(errorMsg));
    })
  );
}
}