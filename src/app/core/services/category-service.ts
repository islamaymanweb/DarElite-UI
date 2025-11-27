 
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICateogry } from '../models/Category ';
 

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.baseURL}Categories`;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<ICateogry[]> {
    return this.http.get<ICateogry[]>(`${this.apiUrl}/get-all`);
  }

  getCategoryById(id: number): Observable<ICateogry> {
    return this.http.get<ICateogry>(`${this.apiUrl}/get-by-id/${id}`);
  }

  addCategory(category: { name: string, description: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-category`, category);
  }

  updateCategory(category: { id: number, name: string, description: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-category`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-category/${id}`);
  }
}