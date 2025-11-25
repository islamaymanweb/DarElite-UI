import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
 
import { catchError, delay, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IPagnation } from '../models/Pagnation';
import { ProductParams } from '../models/ProductParam';
import { IProduct } from '../models/Product';
import { ICateogry } from '../models/Category ';

@Injectable({
  providedIn: 'root'
})
export class ShopService {  private http = inject(HttpClient);
  private baseURL = environment.baseURL;

// shop.service.ts
getProduct(productParam: ProductParams): Observable<IPagnation> {
  // دائماً إرسال قيمة 'a' إذا كان Search فارغاً
  const searchValue = productParam.Search?.trim() || 'a';
  
  let params = new HttpParams()
    .set('PageNumber', productParam.PageNumber.toString())
    .set('pageSize', productParam.pageSize.toString())
    .set('Sort', productParam.Sort)
    .set('Search', searchValue); // قيمة مضمونة

  // إضافة CategoryId فقط إذا كانت موجودة
  if (productParam.CategoryId && productParam.CategoryId > 0) {
    params = params.set('CategoryId', productParam.CategoryId.toString());
  }

  console.log('🔍 API Call with Search:', searchValue);
  
  return this.http.get<IPagnation>(`${this.baseURL}Products/get-all`, { params })
    .pipe(
      catchError(this.handleError)
    );
}

  getCategory(): Observable<ICateogry[]> {
    console.log('🔄 Fetching categories...');
    return this.http.get<ICateogry[]>(`${this.baseURL}Categories/get-all`)
      .pipe(
        catchError(this.handleError)
      );
  }

 
 // shop.service.ts
getProductDetails(id: number): Observable<IProduct> {
  console.log(`🔄 Fetching product details for ID: ${id}`);
 
  return this.http.get<IProduct>(`${this.baseURL}Products/getById?id=${id}`)
    .pipe(
      catchError(this.handleError)
    );
}
  private handleError(error: HttpErrorResponse) {
    console.error('❌ API Error Details:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message,
      errors: error.error?.errors
    });
    
    let errorMessage = 'An unknown error occurred!';
    
    if (error.status === 400) {
      const fieldErrors = error.error?.errors;
      if (fieldErrors) {
        errorMessage = 'Validation Error: ';
        Object.keys(fieldErrors).forEach(key => {
          errorMessage += `${key}: ${fieldErrors[key].join(', ')}. `;
        });
      } else {
        errorMessage = 'Bad Request: Please check your parameters.';
      }
    } else if (error.status === 404) {
      errorMessage = 'Not Found: The requested resource was not found.';
    } else if (error.status === 0) {
      errorMessage = 'Network Error: Please check your connection and CORS settings.';
    } else if (error.status === 500) {
      errorMessage = 'Server Error: Please try again later.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}