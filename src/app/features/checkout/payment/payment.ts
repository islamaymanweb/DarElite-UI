/* import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal, ViewChild } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout-service';
import { BasketService } from '../../../core/services/basket-service';
import { ToastService } from '../../../core/services/toast-service';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IBasket } from '../../../core/models/Basket';
import { ICreateOrder, IOrder } from '../../../core/models/order';
import { CommonModule } from '@angular/common';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment  implements OnInit, AfterViewInit, OnDestroy {
  private checkoutService = inject(CheckoutService);
  private basketService = inject(BasketService);
  private router = inject(Router);

  @Input() paymentForm!: FormGroup;
  @Input() addressForm!: FormGroup;
  @Input() deliveryForm!: FormGroup;
  @Output() previous = new EventEmitter<void>();

  @ViewChild('cardNumber') cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc') cardCvcElement!: ElementRef;

  stripe: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  
  isLoading = signal<boolean>(false);
  cardErrors = signal<string>('');
  orderId = signal<number>(0);

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeStripe();
  }

  ngOnDestroy(): void {
    this.destroyStripeElements();
  }

  initializeStripe(): void {
    this.stripe = Stripe('pk_test_51SWyhbEzsCQQGah3ERYDbtC4P62ueft8MNj2JtxrDQTbVFaKIQc5DiI4VGlB2YbYLbUF7RqGR8m4JEtKjQe93HOV00Pm3Uvy1F');
    
    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.onCardChange.bind(this));

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.onCardChange.bind(this));

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.onCardChange.bind(this));
  }

  destroyStripeElements(): void {
    if (this.cardNumber) this.cardNumber.destroy();
    if (this.cardExpiry) this.cardExpiry.destroy();
    if (this.cardCvc) this.cardCvc.destroy();
  }

  onCardChange(event: any): void {
    if (event.error) {
      this.cardErrors.set(event.error.message);
    } else {
      this.cardErrors.set('');
    }
  }

  async submitOrder(): Promise<void> {
    if (this.paymentForm.invalid || this.cardErrors()) {
      return;
    }

    this.isLoading.set(true);

    try {
      const basket = this.basketService.GetCurrentValue();
      if (!basket) {
        throw new Error('No basket found');
      }

      // Create order first
      const order = this.createOrder(basket);
      await this.createOrderRequest(order);

      // Process payment
      const paymentResult = await this.confirmPaymentWithStripe(basket);
      
      if (paymentResult.paymentIntent) {
        // Success
        this.router.navigate(['/checkout/success'], {
          queryParams: { orderId: this.orderId() }
        });
        this.basketService.deleteBasket();
      } else {
        throw new Error(paymentResult.error?.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      this.cardErrors.set(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  async confirmPaymentWithStripe(basket: IBasket): Promise<any> {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.paymentForm.get('nameOnCard')?.value,
        },
      },
    });
  }

  async createOrderRequest(order: ICreateOrder): Promise<void> {
    return new Promise((resolve, reject) => {
      this.checkoutService.createOrder(order).subscribe({
        next: (orderResponse: IOrder) => {
          this.orderId.set(orderResponse.id);
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  createOrder(basket: IBasket): ICreateOrder {
    return {
      basketId: basket.id,
      deliveryMethodId: this.deliveryForm.get('delivery')?.value,
      shipAddress: this.addressForm.value
    };
  }

  onPrevious(): void {
    this.previous.emit();
  }
} */
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout-service';
import { BasketService } from '../../../core/services/basket-service';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IBasket } from '../../../core/models/Basket';
import { ICreateOrder, IOrder } from '../../../core/models/order';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment implements OnInit, AfterViewInit, OnDestroy {
  private checkoutService = inject(CheckoutService);
  private basketService = inject(BasketService);
  private router = inject(Router);

  @Input() paymentForm!: FormGroup;
  @Input() addressForm!: FormGroup;
  @Input() deliveryForm!: FormGroup;
  @Output() previous = new EventEmitter<void>();

  @ViewChild('cardNumber') cardNumberElement!: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement!: ElementRef;
  @ViewChild('cardCvc') cardCvcElement!: ElementRef;

  stripe: Stripe | null = null;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;

  isLoading = signal<boolean>(false);
  cardErrors = signal<string>('');
  orderId = signal<number>(0);

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    await this.initializeStripe();
  }

  ngOnDestroy(): void {
    this.destroyStripeElements();
  }

  async initializeStripe(): Promise<void> {
    this.stripe = await loadStripe(
      'pk_test_51NQCA3D80BLjniarWdUpT1b2oGB2AvuK8p5bJgUARq7VI9r711MjBPMwi2cnpz3oxtZGMXBy02uy6TkY5aSXZ8Vg008DNOb9hd'
    );

    if (!this.stripe) return;

    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.onCardChange.bind(this));

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.onCardChange.bind(this));

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.onCardChange.bind(this));
  }

  destroyStripeElements(): void {
    if (this.cardNumber) this.cardNumber.destroy();
    if (this.cardExpiry) this.cardExpiry.destroy();
    if (this.cardCvc) this.cardCvc.destroy();
  }

  onCardChange(event: any): void {
    if (event.error) {
      this.cardErrors.set(event.error.message);
    } else {
      this.cardErrors.set('');
    }
  }

  async submitOrder(): Promise<void> {
    if (this.paymentForm.invalid || this.cardErrors()) return;

    this.isLoading.set(true);

    try {
      const basket = this.basketService.GetCurrentValue();
      if (!basket) throw new Error('No basket found');

      // إنشاء الطلب
      const order = this.createOrder(basket);
      await this.createOrderRequest(order);

      // معالجة الدفع
      const paymentResult = await this.confirmPaymentWithStripe(basket);

      if (paymentResult.paymentIntent) {
        this.router.navigate(['/checkout/success'], {
          queryParams: { orderId: this.orderId() },
        });
        this.basketService.deleteBasket();
      } else {
        throw new Error(paymentResult.error?.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      this.cardErrors.set(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  async confirmPaymentWithStripe(basket: IBasket): Promise<any> {
    return this.stripe!.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.paymentForm.get('nameOnCard')?.value,
        },
      },
    });
  }

  async createOrderRequest(order: ICreateOrder): Promise<void> {
    return new Promise((resolve, reject) => {
      this.checkoutService.createOrder(order).subscribe({
        next: (orderResponse: IOrder) => {
          this.orderId.set(orderResponse.id);
          resolve();
        },
        error: (error) => reject(error),
      });
    });
  }

  createOrder(basket: IBasket): ICreateOrder {
    return {
      basketId: basket.id,
      deliveryMethodId: this.deliveryForm.get('delivery')?.value,
      shipAddress: this.addressForm.value,
    };
  }

  onPrevious(): void {
    this.previous.emit();
  }
}
