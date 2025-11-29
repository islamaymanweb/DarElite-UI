import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
 
import { catchError, map, of } from 'rxjs';
import { AdminService } from '../models/admin-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const adminService = inject(AdminService);
  const router = inject(Router);

  return adminService.isAdmin().pipe(
    map((response) => {
      if (response.isAdmin === true) {
        return true;
      } else {
        router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/forbidden'])
      return of(false);
    })
  );
};

