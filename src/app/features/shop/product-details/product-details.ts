 
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../../core/models/Product';
import { ShopService } from '../../../core/services/shop-service';
import { ToastService } from '../../../core/services/toast-service';
import { BasketService } from '../../../core/services/basket-service';
import { ImageZoom } from '../../../core/Component/image-zoom/image-zoom';
 

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule, ImageZoom],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  private shopService = inject(ShopService);
  private basketService = inject(BasketService);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private toastService = inject(ToastService);

  // Product data
  product = signal<IProduct | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  // UI state
  selectedImageIndex = signal<number>(0);
  quantity = signal<number>(1);

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (!id || isNaN(+id)) {
        this.error.set('Invalid product ID');
        this.isLoading.set(false);
        return;
      }

      const productId = +id;
      
      this.shopService.getProductDetails(productId).subscribe({
        next: (product) => {
          this.product.set(product);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set(error.message);
          this.isLoading.set(false);
          this.toastService.error('Error', 'Failed to load product details. Please try again.');
        }
      });
    });
  }
 
  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  hasMultipleImages(): boolean {
    return !!this.product()?.photos && this.product()!.photos.length > 1;
  }

  getMainImage(): string {
    const product = this.product();
    if (!product?.photos || product.photos.length === 0) {
      return 'assets/images/placeholder-image.jpg';
    }
    return `https://localhost:7293${product.photos[this.selectedImageIndex()].imageName}`;
  }
 
  hasDiscount(): boolean {
    const product = this.product();
    return product ? product.oldPrice > product.newPrice : false;
  }

  calculateDiscount(): number {
    const product = this.product();
    if (!product || !this.hasDiscount()) return 0;
    return Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100);
  }

  getTotalPrice(): number {
    const product = this.product();
    return product ? product.newPrice * this.quantity() : 0;
  }

  // Quantity management
  increaseQuantity(): void {
    if (this.quantity() < 10) {
      this.quantity.set(this.quantity() + 1);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
    }
  }

  addToBasket(): void {
    const product = this.product();
    if (product) {
      console.log('🛒 Adding to basket:', {
        product: product.name,
        quantity: this.quantity(),
        price: product.newPrice
      });

      this.basketService.addItemToBasket(product, this.quantity());
      
      this.toastService.success(
        'Added to Cart', 
        `${this.quantity()} ${product.name} added to your collection`
      );

      this.quantity.set(1);
    }
  }
 
  getCraftedDescription(): string {
    const baseDescription = this.product()?.description;
    if (!baseDescription) {
      return 'An exquisite piece showcasing masterful craftsmanship and premium materials, designed to elevate your living space with timeless elegance.';
    }
    
    return baseDescription.length > 150 
      ? baseDescription.substring(0, 150) + '...' 
      : baseDescription;
  }

  getDimensions(): string {
    return '200 × 90 × 85 cm';
  }

  getMaterial(): string {
    const materials = ['Solid Oak', 'Walnut Wood', 'Mahogany', 'Premium Fabric'];
    return materials[Math.floor(Math.random() * materials.length)];
  }

  getFinish(): string {
    const finishes = ['Natural Oil', 'Matte Lacquer', 'Hand-rubbed Wax'];
    return finishes[Math.floor(Math.random() * finishes.length)];
  }

  getWeight(): string {
    return '45 kg';
  }

  getDeliveryEstimate(): string {
    return '2-4 weeks';
  }
}