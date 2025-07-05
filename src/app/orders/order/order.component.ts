import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { IOrder, IOrderItem } from '../../shared/Models/Order';
declare var bootstrap: any;
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  orders!: IOrder[];
  UrlImageModal: string[] = [];
  constructor(private _service: OrdersService) {}
  ngOnInit(): void {
    this._service.getAllOrderForUser().subscribe({
      next: (res) => {
        this.orders = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  OpenModal(order: IOrderItem[]) {
    this.UrlImageModal = order.map((item) => item.mainImage);

    var modal = document.getElementById('ImageModal');
    var modalElement = new bootstrap.Modal(modal);
    modalElement.show();
  }
  CloseModal() {
    var modal=document.getElementById('ImageModal');
    var instance=bootstrap.Modal.getInstance(modal);
    instance.hide();
  }
  getFirstImageOrderItem(order: IOrderItem[]) {
    return order.length > 0 ? order[0].mainImage : null;
  }
}
