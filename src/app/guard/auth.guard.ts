import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { Observable, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const _service = inject(HttpClient);
  const router = inject(Router);
  const baseURL = environment.baseURL;

  return _service.get(baseURL + "Account/IsUserAuth", { withCredentials: true }).pipe(
    map(() => true),
    catchError(() => {
      router.navigate(["/Account/Login"], { queryParams: { returnUrl: state.url } });
      return of(false);
    })
  );
};
