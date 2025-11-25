import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BasketService } from '../../services/basket-service';
import { IBasketTotal } from '../../models/Basket';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-total',
  imports: [CommonModule],
  templateUrl: './order-total.html',
  styleUrl: './order-total.scss',
})
export class OrderTotal  implements OnInit {
  private basketService = inject(BasketService);
  
  basketTotals = signal<IBasketTotal | null>(null);

  ngOnInit(): void {
    this.basketService.basketTotal$.subscribe({
      next: (value) => {
        this.basketTotals.set(value);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}