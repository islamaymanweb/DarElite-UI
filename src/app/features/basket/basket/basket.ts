import { Component, inject, OnInit, signal } from '@angular/core';
import { BasketService } from '../../../core/services/basket-service';
import { IBasket, IBasketItem } from '../../../core/models/Basket';
import { OrderTotal } from "../../../core/Component/order-total/order-total";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-basket',
  imports: [OrderTotal,RouterModule,CommonModule],
  templateUrl: './basket.html',
  styleUrl: './basket.scss',
})
export class Basket  implements OnInit {
  private basketService = inject(BasketService);
  private toastService = inject(ToastService);
  
  basket = signal<IBasket | null>(null);

  ngOnInit(): void {
    this.basketService.basket$.subscribe({
      next: (value) => {
        this.basket.set(value);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  RemoveBasket(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
 
  }

  incrementQuantity(item: IBasketItem) {
    const oldQuantity = item.qunatity;
    this.basketService.incrementBasketItemQuantity(item);
    
  }

  DecrementQuantity(item: IBasketItem) {
    if (item.qunatity > 1) {
      const oldQuantity = item.qunatity;
      this.basketService.DecrementBasketItemQuantity(item);
       
    } else {
      this.toastService.warning('Minimum Quantity', 'Quantity cannot be less than 1. Remove item to delete it.');
    }
  }
  getBasketTotal() {
  if (!this.basket()?.basketItems) return 0;
  return this.basket()!.basketItems.reduce((total, item) => total + (item.qunatity * item.price), 0);
}
}