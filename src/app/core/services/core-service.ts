import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
 
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

// Claim types constants
const ClaimTypes = {
  Name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  Email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
};

export interface User {
  id: string;
  userName: string;
  email: string;
  displayName: string;
  token: string;
}
@Injectable({
  providedIn: 'root',
})
export class CoreService {
 /*  constructor(private http: HttpClient) {}
  baseURL = environment.baseURL;
  private name = new BehaviorSubject<string>('');
  userName$ = this.name.asObservable();
  logout() {
    return this.http.get(this.baseURL + 'Account/Logout').pipe(
      map(() => {
        this.name.next('');
      })
    );
  }
  getUserName() {
    return this.http.get(this.baseURL + 'Account/get-user-name').pipe(
      map((value: any) => {
        this.name.next(value.message);
      })
    );
  } */
  private http = inject(HttpClient);
  private router = inject(Router);

  private baseURL = environment.baseURL;
  
  // استخدام Signals لإدارة الحالة
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  
  // إشارات للاستخدام في المكونات
  isLoggedIn = signal<boolean>(false);
  userName = signal<string>('');
  userEmail = signal<string>('');

  constructor() {
    this.checkStoredUser();
    // محاولة تحديث البيانات من API في الخلفية (اختياري - لا نمسح البيانات إذا فشل)
    this.silentUpdateUserData();
  }

  // تحديث بيانات المستخدم من API بشكل صامت (لا نمسح البيانات إذا فشل)
  private silentUpdateUserData(): void {
    const storedUser = localStorage.getItem('currentUser');
    
    // فقط إذا كانت هناك بيانات محلية، نحاول تحديثها من API
    if (storedUser) {
      // استخدام setTimeout لتأخير الطلب قليلاً حتى لا يؤثر على تحميل الصفحة
      setTimeout(() => {
        this.http.get<any>(this.baseURL + 'Account/get-user-name').subscribe({
          next: (response: any) => {
            // تحديث البيانات بنجاح
            try {
              const user = JSON.parse(storedUser);
              user.displayName = response?.message || user.displayName || user.userName;
              this.currentUserSource.next(user);
              this.updateUserSignals(user);
              localStorage.setItem('currentUser', JSON.stringify(user));
            } catch (error) {
              console.error('Error updating user data:', error);
            }
          },
          error: (error) => {
            // لا نفعل شيء إذا فشل - نحتفظ بالبيانات المحلية
            // فقط نسجل الخطأ للت debugging
            if (error.status === 401 || error.status === 403) {
              console.log('Session expired, but keeping local data until explicit logout');
            } else {
              console.log('Error updating user data, keeping local data:', error.status);
            }
            // لا نمسح البيانات - نحتفظ بها
          }
        });
      }, 500);
    }
  }

  // التحقق من وجود مستخدم مخزن
  private checkStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // تحميل البيانات المحلية مباشرة (الـ token في HttpOnly cookie)
        console.log('Loading user from localStorage:', user);
        this.currentUserSource.next(user);
        this.updateUserSignals(user);
        console.log('User loaded successfully, isLoggedIn:', this.isLoggedIn());
      } catch (error) {
        console.error('Error parsing stored user:', error);
        // فقط إذا كان هناك خطأ في parsing نمسح البيانات
        localStorage.removeItem('currentUser');
      }
    } else {
      console.log('No user data in localStorage');
    }
    // إذا لم تكن هناك بيانات مخزنة، لا نفعل شيء
    // المستخدم غير مسجل دخول
  }

  // تحديث الإشارات بناءً على حالة المستخدم
  private updateUserSignals(user: User | null): void {
    this.isLoggedIn.set(!!user);
    this.userName.set(user?.displayName || user?.userName || '');
    this.userEmail.set(user?.email || '');
  }

  // استخراج البيانات من JWT token
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // الحصول على بيانات المستخدم من API
  private fetchUserData(): Observable<User | null> {
    return this.http.get<any>(this.baseURL + 'Account/get-user-name').pipe(
      map((response: any) => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          // تحديث displayName من API response
          user.displayName = response?.message || user.displayName || user.userName;
          return user;
        }
        // إذا لم تكن هناك بيانات مخزنة، لا يمكننا إنشاء user object
        // لأننا نحتاج email على الأقل
        return null;
      }),
      catchError(() => {
        // إذا فشل API call، استخدم البيانات المخزنة
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          return of(JSON.parse(storedUser));
        }
        return of(null);
      })
    );
  }

  // تسجيل الدخول
  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.baseURL + 'Account/Login', credentials).pipe(
      switchMap(() => {
        // بعد نجاح تسجيل الدخول، احصل على بيانات المستخدم
        return this.http.get<any>(this.baseURL + 'Account/get-user-name').pipe(
          map((response: any) => {
            // إنشاء user object من البيانات المتاحة
            const user: User = {
              id: '', // سيتم ملؤه لاحقاً إذا لزم الأمر
              userName: response?.message || credentials.email?.split('@')[0] || '',
              email: credentials.email || '',
              displayName: response?.message || credentials.email?.split('@')[0] || '',
              token: '' // Token في HttpOnly cookie
            };
            
            console.log('Login successful, saving user:', user);
            this.currentUserSource.next(user);
            this.updateUserSignals(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log('User saved to localStorage, isLoggedIn:', this.isLoggedIn());
            
            return { success: true, user };
          }),
          catchError(() => {
            // إذا فشل API call، استخدم البيانات من credentials
            const user: User = {
              id: '',
              userName: credentials.email?.split('@')[0] || '',
              email: credentials.email || '',
              displayName: credentials.email?.split('@')[0] || '',
              token: ''
            };
            
            this.currentUserSource.next(user);
            this.updateUserSignals(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            return of({ success: true, user });
          })
        );
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }
 
  logout(): Observable<any> {
    return this.http.get(this.baseURL + 'Account/Logout').pipe(
      tap(() => {
        this.clearUserData();
      }),
      catchError((error) => {
        // حتى لو فشل API call، امسح البيانات محلياً
        this.clearUserData();
        return of(null);
      })
    );
  }

  // مسح بيانات المستخدم
  clearUserData(): void {
    console.log('Clearing user data');
    this.currentUserSource.next(null);
    this.updateUserSignals(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    console.log('User data cleared, isLoggedIn:', this.isLoggedIn());
    // لا نوجه المستخدم تلقائياً، دع المكونات تقرر
  }

  // الحصول على بيانات المستخدم الحالي
  getCurrentUser(): User | null {
    return this.currentUserSource.value;
  }

  // التحقق من حالة تسجيل الدخول
  checkLoginStatus(): void {
    const user = this.getCurrentUser();
    this.isLoggedIn.set(!!user);
  }

  // الحصول على اسم المستخدم (للـ Observable)
  getUserName(): Observable<string> {
    return new Observable(subscriber => {
      const user = this.getCurrentUser();
      subscriber.next(user?.displayName || user?.userName || '');
    });
  }

  // الحصول على الأحرف الأولى من اسم المستخدم
  getUserInitials(): string {
    const user = this.getCurrentUser();
    if (!user) return '';
    
    const name = user.displayName || user.userName;
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // الحصول على البريد الإلكتروني
  getUserEmail(): string {
    const user = this.getCurrentUser();
    return user?.email || '';
  }

  // التحقق من صحة التوكن (التحقق من وجود بيانات مستخدم)
  isTokenValid(): boolean {
    // بما أن token في HttpOnly cookie، نتحقق من وجود بيانات مستخدم
    const storedUser = localStorage.getItem('currentUser');
    return !!storedUser;
  }
}

