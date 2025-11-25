import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './success.html',
  styleUrls: ['./success.scss']
})
export class Success  implements OnInit {
  private route = inject(ActivatedRoute);

  orderId = signal<number>(0);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadOrderId();
  }

  loadOrderId(): void {
    this.route.queryParams.subscribe(params => {
      const orderId = params['orderId'];
      if (orderId) {
        this.orderId.set(Number(orderId));
      }
      this.isLoading.set(false);
    });
  }

  getOrderDetailsLink(): string[] {
    return ['/orders', 'item'];
  }

  getOrderQueryParams(): any {
    return { id: this.orderId() };
  }
}