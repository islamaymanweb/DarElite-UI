/* import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IdentityService } from '../../../core/services/identity-service';
import { ToastService } from '../../../core/services/toast-service';
import { ActiveAccount } from '../../../core/models/ActiveAccount';
 

@Component({
  selector: 'app-active',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './active.html',
  styleUrls: ['./active.scss']
})
export class Active   implements AfterViewInit {
  private route = inject(ActivatedRoute);
  private identityService = inject(IdentityService);
  private toast = inject(ToastService);
  private router = inject(Router);

  activeParam = new ActiveAccount();
  isLoading = signal<boolean>(true);
  activationSuccess = signal<boolean>(false);
  activationError = signal<string | null>(null);

  ngAfterViewInit(): void {
    this.activateAccount();
  }

  activateAccount(): void {
    this.route.queryParams.subscribe((param) => {
      this.activeParam.email = param['email'];
      this.activeParam.token = param['code'];

      if (!this.activeParam.email || !this.activeParam.token) {
        this.toast.error('Invalid activation link', 'Please check your email');
        this.router.navigate(['/register']);
        return;
      }

      this.identityService.active(this.activeParam).subscribe({
        next: (response) => {
          console.log('Activation successful:', response);
          this.activationSuccess.set(true);
          this.isLoading.set(false);
          
          this.toast.success(
            'Account Activated Successfully', 
            'You can now sign in to your account'
          );

          // توجيه لصفحة Login بعد 3 ثواني
          setTimeout(() => {
            this.router.navigate(['/login'], {
              queryParams: { 
                email: this.activeParam.email,
                activated: true 
              }
            });
          }, 3000);
        },
        error: (error) => {
          console.error('Activation error:', error);
          this.isLoading.set(false);
          this.activationSuccess.set(false);

          let errorMessage = 'Account activation failed';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Invalid or expired activation link';
          }

          this.activationError.set(errorMessage);
          this.toast.error('Activation Failed', errorMessage);
          
          // توجيه لصفحة التسجيل في حالة الخطأ
          setTimeout(() => {
            this.router.navigate(['/register']);
          }, 3000);
        },
      });
    });
  }
} */
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IdentityService } from '../../../core/services/identity-service';
import { ToastService } from '../../../core/services/toast-service';
import { ActiveAccount } from '../../../core/models/ActiveAccount';

@Component({
  selector: 'app-active',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './active.html',
  styleUrls: ['./active.scss']
})
export class Active implements AfterViewInit {
  private route = inject(ActivatedRoute);
  private identityService = inject(IdentityService);
  private toast = inject(ToastService);
  private router = inject(Router);

  activeParam = new ActiveAccount();
  isLoading = signal<boolean>(true);
  activationSuccess = signal<boolean>(false);
  activationError = signal<string | null>(null);

  ngAfterViewInit(): void {
    this.activateAccount();
  }

  activateAccount(): void {
    this.route.queryParams.subscribe((param) => {
      this.activeParam.email = param['email'];
      this.activeParam.token = param['code'];

      if (!this.activeParam.email || !this.activeParam.token) {
        this.toast.error('Invalid activation link', 'Please check your email');
        this.router.navigate(['/register']);
        return;
      }

      this.identityService.active(this.activeParam).subscribe({
        next: (response) => {
          console.log('Activation successful:', response);
          this.activationSuccess.set(true);
          this.isLoading.set(false);
          
          this.toast.success(
            'Account Activated Successfully', 
            'You can now sign in to your account'
          );

          setTimeout(() => {
            this.router.navigate(['/login'], {
              queryParams: { 
                email: this.activeParam.email,
                activated: true 
              }
            });
          }, 3000);
        },
        error: (error) => {
          console.error('Activation error:', error);
          this.isLoading.set(false);
          this.activationSuccess.set(false);

          let errorMessage = 'Account activation failed';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'Invalid or expired activation link';
          }

          this.activationError.set(errorMessage);
          this.toast.error('Activation Failed', errorMessage);
          
          setTimeout(() => {
            this.router.navigate(['/register']);
          }, 3000);
        },
      });
    });
  }
}