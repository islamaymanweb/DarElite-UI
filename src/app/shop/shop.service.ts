import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductParam } from '../shared/Models/ProductParam';
import { IPagnation } from '../shared/Models/Pagnation';
import { ICateogry } from '../shared/Models/Category';
import { IProduct } from '../shared/Models/Product';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  constructor(private http: HttpClient) { }

  baseURL = environment.baseURL;

  getProduct(productParam: ProductParam) {
    // إنشاء كائن المعلمات بشكل منفصل
    let params: any = {
      pageNumber: productParam.pageNumber.toString(),
      pageSize: productParam.pageSize.toString(),
      Sort: productParam.SortSelected,
      Search: productParam.search || null // إرسال null بدلاً من سلسلة فارغة
    };

    // إضافة CategoryId فقط إذا كانت قيمته > 0
    if (productParam.CategoryId > 0) {
      params.CategoryId = productParam.CategoryId.toString();
    }

    return this.http.get<IPagnation>(this.baseURL + 'Products/get-all', { 
      params: this.removeNullParams(params) 
    });
  }

  private removeNullParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return httpParams;
  }

  getCategory() {
    return this.http.get<ICateogry[]>(this.baseURL + "Categories/get-all");
  }

  getProductDetails(id: number) {
    return this.http.get<IProduct>(this.baseURL + "Products/get-by-id/" + id);
  }

  // getProductRating(id: number) {
  //   return this.http.get<IReview[]>(this.baseURL + "Ratings/get-rating/" + id);
  // }
}