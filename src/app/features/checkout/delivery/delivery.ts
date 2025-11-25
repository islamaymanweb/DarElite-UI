import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout-service';
import { BasketService } from '../../../core/services/basket-service';
import { ToastService } from '../../../core/services/toast-service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Delivery } from '../../../core/models/Delivery';

@Component({
  selector: 'app-delivery',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './delivery.html',
  styleUrl: './delivery.scss',
})
export class DeliveryComponent   implements OnInit {
  private checkoutService = inject(CheckoutService);
  private basketService = inject(BasketService);

  @Input() deliveryForm!: FormGroup;
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  deliveries = signal<Delivery[]>([]);
  isLoading = signal<boolean>(true);
  selectedDelivery = signal<Delivery | null>(null);

  ngOnInit(): void {
    this.loadDeliveryMethods();
  }

  loadDeliveryMethods(): void {
    this.checkoutService.getDeliveryMethod().subscribe({
      next: (deliveries) => {
        this.deliveries.set(deliveries);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading delivery methods:', error);
        this.isLoading.set(false);
      }
    });
  }

  onDeliveryChange(): void {
    const deliveryId = this.deliveryForm.get('delivery')?.value;
    const delivery = this.deliveries().find(d => d.id == deliveryId);
    
    if (delivery) {
      this.selectedDelivery.set(delivery);
      this.basketService.SetShippingPrice(delivery);
      this.createPaymentIntent(delivery.id);
    }
  }

  createPaymentIntent(deliveryId: number): void {
    this.basketService.CreatePaymentIntent(deliveryId).subscribe({
      next: (response) => {
        console.log('Payment intent created:', response);
      },
      error: (error) => {
        console.error('Error creating payment intent:', error);
      }
    });
  }

  onNext(): void {
    if (this.deliveryForm.valid) {
      this.next.emit();
    }
  }

  onPrevious(): void {
    this.previous.emit();
  }
}