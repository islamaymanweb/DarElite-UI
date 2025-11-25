 
 import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotal } from '../models/Basket';
import { Delivery } from '../models/Delivery';
import { IProduct } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
/* export class BasketService {
  private http = inject(HttpClient);
  
  BaseURL = environment.baseURL;
  
  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();
  
  private basketSourceTotal = new BehaviorSubject<IBasketTotal | null>(null);
  basketTotal$ = this.basketSourceTotal.asObservable();
  
  shipPrice: number = 0;

  SetShippingPrice(delivery: Delivery) {
    this.shipPrice = delivery.price;
    this.calculateTotal();
  }

  CreatePaymentIntent(deliveryMethodId: number = 3): Observable<any> {
    const basket = this.GetCurrentValue();
    if (!basket) throw new Error('No basket available');
    
    return this.http.post(
      this.BaseURL + `Payments/Create?basketId=${basket.id}&deliveryId=${deliveryMethodId}`,
      {}
    );
  }

  deleteBasket() {
    this.basketSource.next(null);
    this.basketSourceTotal.next(null);
    localStorage.removeItem('basketId');
    console.log('Basket deleted locally');
  }

  calculateTotal() {
    const basket = this.GetCurrentValue();
    if (!basket) {
      this.basketSourceTotal.next(null);
      return;
    }
    
    const shipping = this.shipPrice;
    const subtotal = basket.basketItems.reduce((a, c) => (c.price * c.qunatity) + a, 0);
    const total = shipping + subtotal;
    this.basketSourceTotal.next({ shipping, subtotal, total });
    console.log('Calculated totals:', { shipping, subtotal, total });
  }

  GetBasket(id: string): Observable<IBasket> {
    return this.http.get<IBasket>(this.BaseURL + 'Baskets/get-basket-item/' + id).pipe(
      tap((value: IBasket) => {
        this.basketSource.next(value);
        this.calculateTotal();
        console.log('Basket loaded:', value);
      })
    );
  }

  SetBasket(basket: IBasket) {
    return this.http.post<IBasket>(this.BaseURL + 'Baskets/update-basket', basket).subscribe({
      next: (value: IBasket) => {
        this.basketSource.next(value);
        this.calculateTotal();
        console.log('Basket updated:', value);
      },
      error: (err) => {
        console.error('Error updating basket:', err);
      }
    });
  }

  GetCurrentValue(): IBasket | null {
    return this.basketSource.value;
  }

  addItemToBasket(product: IProduct, quantity: number = 1) {
    console.log('🛒 Adding item to basket:', product.name, 'Quantity:', quantity);
    
    const itemToAdd = this.MapProductToBasketItem(product, quantity);
    let basket = this.GetCurrentValue() ?? this.CreateBasket();

    basket.basketItems = this.AddOrUpdate(basket.basketItems, itemToAdd, quantity);
    this.SetBasket(basket);
    
    console.log('✅ Item added successfully. Current basket:', basket);
  }

private AddOrUpdate(
  basketItems: IBasketItem[],
  itemToAdd: IBasketItem,
  quantity: number
): IBasketItem[] {
  const index = basketItems.findIndex(i => i.id === itemToAdd.id);
  
  if (index === -1) {
    
    itemToAdd.qunatity = quantity;
    basketItems.push(itemToAdd);
    console.log('➕ New item added with quantity:', quantity);
  } else {
    
    basketItems[index].qunatity = quantity;
    console.log('🔄 Existing item quantity replaced with:', quantity);
  }
  
  return basketItems;
}

  private CreateBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basketId', basket.id);
    console.log('🆕 New basket created:', basket.id);
    return basket;
  }

  private MapProductToBasketItem(
    product: IProduct,
    quantity: number
  ): IBasketItem {
    return {
      id: product.id,
      category: product.categoryName,
      image: product.photos[0]?.imageName || 'default-image.jpg',
      name: product.name,
      price: product.newPrice,
      qunatity: quantity,  
      description: product.description,
    };
  }

  incrementBasketItemQuantity(item: IBasketItem) {
    console.log('➕ Incrementing quantity for:', item.name);
    
    const basket = this.GetCurrentValue();
    if (!basket) return;
    
    const itemIndex = basket.basketItems.findIndex(i => i.id === item.id);
    if (itemIndex > -1) {
      basket.basketItems[itemIndex].qunatity++;
      console.log('✅ Quantity incremented to:', basket.basketItems[itemIndex].qunatity);
      this.SetBasket(basket);
    }
  }

  DecrementBasketItemQuantity(item: IBasketItem) {
    console.log('➖ Decrementing quantity for:', item.name);
    
    const basket = this.GetCurrentValue();
    if (!basket) return;
    
    const itemIndex = basket.basketItems.findIndex(i => i.id === item.id);
    if (itemIndex > -1) {
      if (basket.basketItems[itemIndex].qunatity > 1) {
        basket.basketItems[itemIndex].qunatity--;
        console.log('✅ Quantity decremented to:', basket.basketItems[itemIndex].qunatity);
        this.SetBasket(basket);
      } else {
        console.log('🗑️ Quantity is 1, removing item');
        this.removeItemFromBasket(item);
      }
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    console.log('🚀 Removing item from basket:', item.name);
    
    const basket = this.GetCurrentValue();
    if (!basket) {
      console.log('❌ No basket found');
      return;
    }
    
    console.log('📦 Current basket items before removal:', basket.basketItems.length);
    
    const itemExists = basket.basketItems.some(i => i.id === item.id);
    if (!itemExists) {
      console.log('❌ Item not found in basket');
      return;
    }
    
    
    basket.basketItems = basket.basketItems.filter(i => i.id !== item.id);
    console.log('✅ Items after removal:', basket.basketItems.length);
    
    if (basket.basketItems.length > 0) {
      console.log('🔄 Updating basket with remaining items');
      this.SetBasket(basket);
    } else {
      console.log('🗑️ No items left, deleting entire basket');
      this.DeleteBasketItem(basket);
    }
  }

  DeleteBasketItem(basket: IBasket) {
    console.log('🗑️ Deleting basket from server:', basket.id);
    
    return this.http.delete(this.BaseURL + 'Baskets/delete-basket-item/' + basket.id).subscribe({
      next: () => {
        console.log('✅ Basket deleted successfully from server');
        this.basketSource.next(null);
        this.basketSourceTotal.next(null);
        localStorage.removeItem('basketId');
        console.log('✅ Basket cleared locally');
      },
      error: (err) => {
        console.error('❌ Error deleting basket:', err);
 
        this.basketSource.next(null);
        this.basketSourceTotal.next(null);
        localStorage.removeItem('basketId');
        console.log('✅ Basket cleared locally despite server error');
      }
    });
  }

  // دالة مساعدة للحصول على كمية عنصر محدد
  getItemQuantity(productId: number): number {
    const basket = this.GetCurrentValue();
    if (!basket) return 0;
    
    const item = basket.basketItems.find(i => i.id === productId);
    return item ? item.qunatity : 0;
  }

 
  updateItemQuantity(productId: number, newQuantity: number) {
    console.log('🔄 Updating quantity for product:', productId, 'to:', newQuantity);
    
    const basket = this.GetCurrentValue();
    if (!basket) return;
    
    const itemIndex = basket.basketItems.findIndex(i => i.id === productId);
    if (itemIndex > -1) {
      if (newQuantity > 0) {
        basket.basketItems[itemIndex].qunatity = newQuantity;
        console.log('✅ Quantity updated to:', newQuantity);
        this.SetBasket(basket);
      } else {
        
        this.removeItemFromBasket(basket.basketItems[itemIndex]);
      }
    }
  }
} */
export class BasketService {
  private http = inject(HttpClient);
  
  BaseURL = environment.baseURL;
  
  private basketSource = new BehaviorSubject<IBasket | null>(null);
  basket$ = this.basketSource.asObservable();
  
  private basketSourceTotal = new BehaviorSubject<IBasketTotal | null>(null);
  basketTotal$ = this.basketSourceTotal.asObservable();
  
  shipPrice: number = 0;

  SetShippingPrice(delivery: Delivery) {
    this.shipPrice = delivery.price;
    this.calculateTotal();
  }

  CreatePaymentIntent(deliveryMethodId: number = 3): Observable<any> {
    const basket = this.GetCurrentValue();
    if (!basket) throw new Error('No basket available');
    
    return this.http.post(
      this.BaseURL + `Payments/Create?basketId=${basket.id}&deliveryId=${deliveryMethodId}`,
      {}
    );
  }

  deleteBasket() {
    this.basketSource.next(null);
    this.basketSourceTotal.next(null);
    localStorage.removeItem('basketId');
    console.log('Basket deleted locally');
  }

  calculateTotal() {
    const basket = this.GetCurrentValue();
    if (!basket) {
      this.basketSourceTotal.next(null);
      return;
    }
    
    const shipping = this.shipPrice;
    const subtotal = basket.basketItems.reduce((a, c) => (c.price * c.qunatity) + a, 0);
    const total = shipping + subtotal;
    this.basketSourceTotal.next({ shipping, subtotal, total });
    console.log('Calculated totals:', { shipping, subtotal, total });
  }

  GetBasket(id: string): Observable<IBasket> {
    return this.http.get<IBasket>(this.BaseURL + 'Baskets/get-basket-item/' + id).pipe(
      tap((value: IBasket) => {
        this.basketSource.next(value);
        this.calculateTotal();
        console.log('Basket loaded:', value);
      })
    );
  }

  SetBasket(basket: IBasket) {
    return this.http.post<IBasket>(this.BaseURL + 'Baskets/update-basket', basket).subscribe({
      next: (value: IBasket) => {
        this.basketSource.next(value);
        this.calculateTotal();
        console.log('Basket updated:', value);
      },
      error: (err) => {
        console.error('Error updating basket:', err);
      }
    });
  }

  GetCurrentValue(): IBasket | null {
    return this.basketSource.value;
  }

  addItemToBasket(product: IProduct, quantity: number = 1) {
    console.log('🛒 Adding item to basket:', product.name, 'Quantity:', quantity);
    
    const itemToAdd = this.MapProductToBasketItem(product, quantity);
    let basket = this.GetCurrentValue() ?? this.CreateBasket();

    basket.basketItems = this.AddOrUpdate(basket.basketItems, itemToAdd, quantity);
    this.SetBasket(basket);
    
    console.log('✅ Item added successfully. Current basket:', basket);
  }

  private AddOrUpdate(
    basketItems: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    const index = basketItems.findIndex(i => i.id === itemToAdd.id);
    
    if (index === -1) {
      itemToAdd.qunatity = quantity;
      basketItems.push(itemToAdd);
      console.log('➕ New item added with quantity:', quantity);
    } else {
      basketItems[index].qunatity = quantity;
      console.log('🔄 Existing item quantity replaced with:', quantity);
    }
    
    return basketItems;
  }

  private CreateBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basketId', basket.id);
    console.log('🆕 New basket created:', basket.id);
    return basket;
  }

  private MapProductToBasketItem(
    product: IProduct,
    quantity: number
  ): IBasketItem {
    return {
      id: product.id,
      category: product.categoryName,
      image: product.photos[0]?.imageName || 'default-image.jpg',
      name: product.name,
      price: product.newPrice,
      qunatity: quantity,  
      description: product.description,
    };
  }

  incrementBasketItemQuantity(item: IBasketItem) {
    console.log('➕ Incrementing quantity for:', item.name);
    
    const basket = this.GetCurrentValue();
    if (!basket) return;
    
    const itemIndex = basket.basketItems.findIndex(i => i.id === item.id);
    if (itemIndex > -1) {
      basket.basketItems[itemIndex].qunatity++;
      console.log('✅ Quantity incremented to:', basket.basketItems[itemIndex].qunatity);
      this.SetBasket(basket);
    }
  }

  DecrementBasketItemQuantity(item: IBasketItem) {
    console.log('➖ Decrementing quantity for:', item.name);
    
    const basket = this.GetCurrentValue();
    if (!basket) return;
    
    const itemIndex = basket.basketItems.findIndex(i => i.id === item.id);
    if (itemIndex > -1) {
      if (basket.basketItems[itemIndex].qunatity > 1) {
        basket.basketItems[itemIndex].qunatity--;
        console.log('✅ Quantity decremented to:', basket.basketItems[itemIndex].qunatity);
        this.SetBasket(basket);
      } else {
        console.log('🗑️ Quantity is 1, removing item');
        this.removeItemFromBasket(item);
      }
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    console.log('🚀 Removing item from basket:', item.name);
    
    const basket = this.GetCurrentValue();
    if (!basket) {
      console.log('❌ No basket found');
      return;
    }
    
    console.log('📦 Current basket items before removal:', basket.basketItems.length);
    
    const itemExists = basket.basketItems.some(i => i.id === item.id);
    if (!itemExists) {
      console.log('❌ Item not found in basket');
      return;
    }
    
    basket.basketItems = basket.basketItems.filter(i => i.id !== item.id);
    console.log('✅ Items after removal:', basket.basketItems.length);
    
    if (basket.basketItems.length > 0) {
      console.log('🔄 Updating basket with remaining items');
      this.SetBasket(basket);
    } else {
      console.log('🗑️ No items left, deleting entire basket');
      this.DeleteBasketItem(basket);
    }
  }

  DeleteBasketItem(basket: IBasket) {
    console.log('🗑️ Deleting basket from server:', basket.id);
    
    return this.http.delete(this.BaseURL + 'Baskets/delete-basket-item/' + basket.id).subscribe({
      next: () => {
        console.log('✅ Basket deleted successfully from server');
        this.basketSource.next(null);
        this.basketSourceTotal.next(null);
        localStorage.removeItem('basketId');
        console.log('✅ Basket cleared locally');
      },
      error: (err) => {
        console.error('❌ Error deleting basket:', err);
        this.basketSource.next(null);
        this.basketSourceTotal.next(null);
        localStorage.removeItem('basketId');
        console.log('✅ Basket cleared locally despite server error');
      }
    });
  }

  getItemQuantity(productId: number): number {
    const basket = this.GetCurrentValue();
    if (!basket) return 0;
    
    const item = basket.basketItems.find(i => i.id === productId);
    return item ? item.qunatity : 0;
  }

  updateItemQuantity(productId: number, newQuantity: number) {
    console.log('🔄 Updating quantity for product:', productId, 'to:', newQuantity);
    
    const basket = this.GetCurrentValue();
    if (!basket) return;
    
    const itemIndex = basket.basketItems.findIndex(i => i.id === productId);
    if (itemIndex > -1) {
      if (newQuantity > 0) {
        basket.basketItems[itemIndex].qunatity = newQuantity;
        console.log('✅ Quantity updated to:', newQuantity);
        this.SetBasket(basket);
      } else {
        this.removeItemFromBasket(basket.basketItems[itemIndex]);
      }
    }
  }
}