import { Component, inject, OnInit, signal } from '@angular/core';
import { OrdersService } from '../../../core/services/orders-service';
import { ToastService } from '../../../core/services/toast-service';
import { IOrder, IOrderItem } from '../../../core/models/order';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order',
  imports: [CommonModule, RouterModule],
  templateUrl: './order.html',
  styleUrl: './order.scss',
})
export class Order  implements OnInit {
  private ordersService = inject(OrdersService);
  private toast = inject(ToastService);

  orders = signal<IOrder[]>([]);
  urlImageModal = signal<string[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getAllOrderForUser().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.toast.error('Error', 'Failed to load orders');
        this.isLoading.set(false);
      }
    });
  }

  openModal(orderItems: IOrderItem[]): void {
    this.urlImageModal.set(orderItems.map(item => item.mainImage));
    
    // استخدام Modal من Bootstrap 5
    const modalElement = document.getElementById('ImageModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('ImageModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  getFirstImageOrderItem(orderItems: IOrderItem[]): string {
    return orderItems.length > 0 ? orderItems[0].mainImage : '';
  }

  getImageUrl(imagePath: string): string {
    return `https://localhost:7293/${imagePath}`;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-badge status-pending';
      case 'PaymentFailed':
        return 'status-badge status-failed';
      case 'PaymentReceived':
        return 'status-badge status-success';
      default:
        return 'status-badge status-default';
    }
  }
}