import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Stepper } from '../stepper/stepper';
import { OrderTotal } from '../../../core/Component/order-total/order-total';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, Stepper , OrderTotal],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {

}
