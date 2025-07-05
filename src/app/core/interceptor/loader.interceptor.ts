import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { finalize, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class loaderInterceptor implements HttpInterceptor {
  constructor(private _service:LoadingService){}
  intercept(request: HttpRequest<any>,next: HttpHandler):

  Observable<HttpEvent<any>> {
  this._service.loading()
 
    return next.handle(request).pipe(
      
      finalize(()=>{
       
        this._service.hideLoader();
      })
    );
  }
  
}