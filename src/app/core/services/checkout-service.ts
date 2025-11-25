import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import { ICreateOrder, IOrder } from '../models/order';
import { environment } from '../../../environments/environment';
import { Delivery } from '../models/Delivery';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private http = inject(HttpClient);
  
  baseURL = environment.baseURL;

  updateAddress(form: any) {
    return this.http.put(this.baseURL + 'Account/update-address', form);
  }

  getAddress() {
    return this.http.get(this.baseURL + 'Account/get-address-for-user');
  }

  getDeliveryMethod() {
    return this.http.get<Delivery[]>(this.baseURL + 'Orders/get-delivery');
  }

  createOrder(order: ICreateOrder) {
    return this.http.post<IOrder>(this.baseURL + 'Orders/create-order', order);
  }
}