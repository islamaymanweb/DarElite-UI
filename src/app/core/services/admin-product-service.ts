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
  photo: FileList;  
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
     
    formData.append('Name', productData.name);
    formData.append('Description', productData.description);
    formData.append('NewPrice', productData.newPrice.toString());
    formData.append('OldPrice', productData.oldPrice.toString());
    formData.append('CategoryId', productData.categoryId.toString());
    
    
    if (productData.photo && productData.photo.length > 0) {
      for (let i = 0; i < productData.photo.length; i++) {
        formData.append('Photo', productData.photo[i]); 
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
     
    if (productData.photo && productData.photo.length > 0) {
      for (let i = 0; i < productData.photo.length; i++) {
        formData.append('Photo', productData.photo[i]);  
      }
    }

    return this.http.put(`${this.baseURL}/Update-Product`, formData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/Delete-Product/${id}`);
  }
}
