import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  AddAdminDTO,
  AdminInfoDTO,
  RemoveAdminDTO,
  AdminResponse,
  AdminListResponse,
  AdminCheckResponse,
} from '../models/admin';
import { ResponseAPI } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  baseURL = environment.baseURL;

  /**
   * Add a new admin user
   */
  addAdmin(adminDTO: AddAdminDTO): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(
      this.baseURL + 'Admin/add-admin',
      adminDTO,
      { withCredentials: true }
    );
  }

  /**
   * Remove admin role from a user
   */
  removeAdmin(removeAdminDTO: RemoveAdminDTO): Observable<ResponseAPI> {
    return this.http.post<ResponseAPI>(
      this.baseURL + 'Admin/remove-admin',
      removeAdminDTO,
      { withCredentials: true }
    );
  }

  /**
   * Get all admin users
   */
  getAllAdmins(): Observable<AdminListResponse> {
    return this.http.get<AdminListResponse>(
      this.baseURL + 'Admin/get-all-admins',
      { withCredentials: true }
    );
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): Observable<AdminCheckResponse> {
    return this.http.get<AdminCheckResponse>(
      this.baseURL + 'Admin/is-admin',
      { withCredentials: true }
    );
  }
}

