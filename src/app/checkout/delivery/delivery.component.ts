import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { Delivery } from '../../shared/Models/Delivery';
import { BasketService } from '../../basket/basket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss',
})
export class DeliveryComponent implements OnInit {
  @Input() delivery!: FormGroup;
  deliveries: Delivery[] = [];
  constructor(
    private _service: CheckoutService,
    private basketService: BasketService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this._service.getDeliveryMethod().subscribe({
      next: (value) => {
        this.deliveries = value;
      },
      error(err) {
        console.log(err);
      },
    });
  }
/*   CreatePayment() {
    const id = this.deliveries.find(
      (m) => m.id == this.delivery.value.delivery
    ).id;
    this.basketService.CreatePaymentIntent(id).subscribe({
      next: (res) => {
        this.toast.success('Payment Intent Created', 'SUCCESS');
      },
      error(err) {
        console.log(err);
        
      },
    });
  } */
    CreatePayment() {
      const id = this.deliveries.find(
        (m) => m.id == this.delivery.value.delivery
      )?.id; // استخدام ?. هنا
    
      if (!id) {
        this.toast.error('Delivery not found', 'ERROR');
        return;
      }
    
      this.basketService.CreatePaymentIntent(id).subscribe({
        next: (res) => {
          this.toast.success('Payment Intent Created', 'SUCCESS');
        },
        error: (err) => {
          console.log(err);
          this.toast.error('Failed to create payment intent', 'ERROR');
        },
      });
    }/* 
    SetShipptingPrice() {
    const delivery = this.deliveries.find(
      (m) => m.id == this.delivery.value.delivery
    );
    this.basketService.SetShippingPrice(delivery);
  } */
    SetShippingPrice() {
      const delivery = this.deliveries.find(
        (m) => m.id == this.delivery.value.delivery
      );
      
      if (!delivery) {
        console.error('Delivery method not found');
        return; // أو يمكنك إظهار رسالة خطأ للمستخدم
      }
      
      this.basketService.SetShippingPrice(delivery);
    }
}
