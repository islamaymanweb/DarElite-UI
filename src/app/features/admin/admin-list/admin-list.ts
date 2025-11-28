import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';
import { AdminInfoDTO } from '../../../core/models/admin';
import { ResponseAPI } from '../../../core/models/login';
import { AdminService } from '../../../core/models/admin-service';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-list.html',
  styleUrls: ['./admin-list.scss']
})
export class AdminList implements OnInit {
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  admins = signal<AdminInfoDTO[]>([]);
  isLoading = signal<boolean>(false);
  showRemoveModal = signal<boolean>(false);
  selectedAdminEmail = signal<string>('');

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.isLoading.set(true);
    this.adminService.getAllAdmins().subscribe({
      next: (response) => {
        if (response.data) {
          this.admins.set(response.data);
        } else {
          this.admins.set([]);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading admins:', error);
        this.toast.error('Failed to load admins', 'Please try again later');
        this.isLoading.set(false);
      }
    });
  }

  openRemoveModal(admin: AdminInfoDTO): void {
    this.selectedAdminEmail.set(admin.email);
    this.showRemoveModal.set(true);
  }

  closeRemoveModal(): void {
    this.showRemoveModal.set(false);
    this.selectedAdminEmail.set('');
  }

  confirmRemove(): void {
    if (!this.selectedAdminEmail()) {
      return;
    }

    this.adminService.removeAdmin({ email: this.selectedAdminEmail() }).subscribe({
      next: (response: ResponseAPI) => {
        this.toast.success('Admin removed', response.message || 'The admin role has been removed successfully');
        this.loadAdmins();
        this.closeRemoveModal();
      },
      error: (error) => {
        console.error('Error removing admin:', error);
        let errorMessage = 'Failed to remove admin';
        if (error.error?.message) {
          errorMessage = error.error.message;
        }
        this.toast.error('Failed to remove admin', errorMessage);
      }
    });
  }
}

