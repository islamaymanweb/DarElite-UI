
import { Component, OnInit } from '@angular/core';
import { BasketService } from '../basket.service';
import { IBasket, IBasketItem } from '../../shared/Models/Basket';


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket: IBasket | null = null;

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.loadBasket();
  }

  private loadBasket(): void {
    this.basketService.basket$.subscribe({
      next: (basket) => this.basket = basket,
      error: (err) => console.error('Basket load error:', err)
    });
  }

  removeBasketItem(item: IBasketItem): void {
    this.basketService.removeItemFromBasket(item);
  }

  incrementItemQuantity(item: IBasketItem): void {
    this.basketService.incrementBasketItemQuantity(item);
  }

  decrementItemQuantity(item: IBasketItem): void {
    this.basketService.DecrementBasketItemQuantity(item); // Note: Matches service's exact method name
  }

  get basketItems(): IBasketItem[] {
    return this.basket?.basketItems || [];
  }

  get basketTotal(): number {
    return this.basketItems.reduce((total, item) => 
      total + (item.price * item.qunatity), 0); // Note: Using 'qunatity' (with typo)
  }
}