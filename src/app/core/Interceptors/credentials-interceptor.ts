import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const apiOrigin = environment.baseURL.replace(/\/+$/, '');

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const shouldAttachCredentials =
    req.url.startsWith(apiOrigin) && !req.withCredentials;

  const request = shouldAttachCredentials
    ? req.clone({ withCredentials: true })
    : req;

  return next(request);
};
