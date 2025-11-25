import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrdersService } from '../../../core/services/orders-service';
import { ToastService } from '../../../core/services/toast-service';
import { IOrder } from '../../../core/models/order';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-item',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-item.html',
  styleUrl: './order-item.scss',
})
export class OrderItem implements OnInit {
  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);
  private toast = inject(ToastService);

  order = signal<IOrder | null>(null);

  
  isLoading = signal<boolean>(true);
  showRatingModal = signal<boolean>(false);

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {
    const orderId = this.route.snapshot.queryParams['id'];
    
    if (!orderId) {
      this.toast.error('Error', 'Order ID not found');
      this.isLoading.set(false);
      return;
    }

    this.ordersService.getCurrentOrderForUser(parseInt(orderId)).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.toast.error('Error', 'Failed to load order details');
        this.isLoading.set(false);
      }
    });
  }

 

 

   

  getImageUrl(imagePath: string): string {
    return `https://localhost:7293/${imagePath}`;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'PaymentFailed':
        return 'status-failed';
      case 'PaymentReceived':
        return 'status-success';
      default:
        return 'status-default';
    }
  }

  calculateShippingCost(): number {
    const order = this.order();
    return order ? order.total - order.subTotal : 0;
  }
}