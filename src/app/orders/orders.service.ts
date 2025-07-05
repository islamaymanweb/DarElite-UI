import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IOrder } from '../shared/Models/Order';


@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}
  BaseURl = environment.baseURL;
  getCurrentOrderForUser(id:number){
    return this.http.get<IOrder>(this.BaseURl+"Orders/get-order-by-id/"+id)
  }
  getAllOrderForUser(){
    return this.http.get<IOrder[]>(this.BaseURl+"Orders/get-orders-for-user")
  }
}
