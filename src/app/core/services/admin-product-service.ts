 import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
 
import { IProduct } from '../models/Product';
import { environment } from '../../../environments/environment';
 
export interface AddProductDTO {
  name: string;
  description: string;
  newPrice: number;
  oldPrice: number;
  categoryId: number;
  photo: FileList; // استخدام FileList بدلاً من File[]
}

export interface UpdateProductDTO extends AddProductDTO {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {
  private http = inject(HttpClient);
  private baseURL = `${environment.baseURL}Products`;

  getAllProducts(): Observable<IProduct[]> {
    const params = new HttpParams()
      .set('PageNumber', '1')
      .set('pageSize', '100')
      .set('Sort', 'Name')
      .set('Search', 'a');

    return this.http.get<any>(`${this.baseURL}/get-all`, { params })
      .pipe(
        map(response => {
          // تعديل حسب هيكل ال response الفعلي
          if (response && response.data) {
            return response.data;
          } else if (Array.isArray(response)) {
            return response;
          } else {
            return [];
          }
        })
      );
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.baseURL}/getById?id=${id}`);
  }

  addProduct(productData: AddProductDTO): Observable<any> {
    const formData = new FormData();
    
    // إضافة البيانات الأساسية
    formData.append('Name', productData.name);
    formData.append('Description', productData.description);
    formData.append('NewPrice', productData.newPrice.toString());
    formData.append('OldPrice', productData.oldPrice.toString());
    formData.append('CategoryId', productData.categoryId.toString());
    
    // إضافة جميع الصور - التصحيح هنا
    if (productData.photo && productData.photo.length > 0) {
      for (let i = 0; i < productData.photo.length; i++) {
        formData.append('Photo', productData.photo[i]); // يجب أن يكون 'Photo' وليس 'Photos'
      }
    }

    console.log('📤 FormData contents:');
    for (let pair of (formData as any).entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    return this.http.post(`${this.baseURL}/Add-Product`, formData);
  }

  updateProduct(productData: UpdateProductDTO): Observable<any> {
    const formData = new FormData();
    formData.append('Id', productData.id.toString());
    formData.append('Name', productData.name);
    formData.append('Description', productData.description);
    formData.append('NewPrice', productData.newPrice.toString());
    formData.append('OldPrice', productData.oldPrice.toString());
    formData.append('CategoryId', productData.categoryId.toString());
    
    // إضافة الصور الجديدة إذا وجدت
    if (productData.photo && productData.photo.length > 0) {
      for (let i = 0; i < productData.photo.length; i++) {
        formData.append('Photo', productData.photo[i]); // نفس الاسم 'Photo'
      }
    }

    return this.http.put(`${this.baseURL}/Update-Product`, formData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/Delete-Product/${id}`);
  }
}
