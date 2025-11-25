import { CanActivateFn, Router } from '@angular/router';
 
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
 
export const authGuard: CanActivateFn = (route, state) => {
  const _service = inject(HttpClient);
  const router = inject(Router);
  const baseURL = environment.baseURL;

  return _service.get(baseURL + 'Account/IsUserAuth', { withCredentials: true }).pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};