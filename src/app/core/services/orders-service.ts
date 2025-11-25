import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import { IOrder } from '../models/order';
import { environment } from '../../../environments/environment';
 

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private http = inject(HttpClient);
  
  BaseURl = environment.baseURL;

  getCurrentOrderForUser(id: number) {
    return this.http.get<IOrder>(this.BaseURl + "Orders/get-order-by-id/" + id);
  }

  getAllOrderForUser() {
    return this.http.get<IOrder[]>(this.BaseURl + "Orders/get-orders-for-user");
  }

/*   addRating(rate: IRating) {
    return this.http.post(this.BaseURl + "Ratings/add-rating", rate);
  } */
}