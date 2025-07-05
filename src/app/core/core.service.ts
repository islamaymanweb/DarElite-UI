import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Check if user is logged in on service initialization
    this.checkLoginStatus();
  }
  
  baseURL = environment.baseURL;
  private name = new BehaviorSubject<string>('');
  userName$ = this.name.asObservable();

  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  checkLoginStatus() {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn.next(true);
        this.getUserName().subscribe();
      } else {
        this.isLoggedIn.next(false);
        this.name.next('');
      }
    }
  }

  logout() {
    return this.http.get(this.baseURL + 'Account/Logout').pipe(
      map(() => {
        if (this.isBrowser()) {
          localStorage.removeItem('token');
        }
        this.name.next('');
        this.isLoggedIn.next(false);
      })
    );
  }

  getUserName() {
    return this.http.get(this.baseURL + 'Account/get-user-name').pipe(
      map((value: any) => {
        this.name.next(value.message);
        return value.message;
      })
    );
  }
}
