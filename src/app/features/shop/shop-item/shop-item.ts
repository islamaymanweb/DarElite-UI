import { Component, inject, Input, signal } from '@angular/core';
import { IProduct } from '../../../core/models/Product';
 
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BasketService } from '../../../core/services/basket-service';
import { ToastService } from '../../../core/services/toast-service';
import { ImageZoom } from '../../../core/Component/image-zoom/image-zoom';
 

@Component({
  selector: 'app-shop-item',
  imports: [CommonModule, RouterModule],
  templateUrl: './shop-item.html',
  styleUrl: './shop-item.scss',
})
export class ShopItem {

   private basketService = inject(BasketService);
  private toastService = inject(ToastService);

  @Input({ required: true }) Product!: IProduct;
     
private router = inject(Router);
  // UI State
  isFavorited: boolean = false;

  // ===== ORIGINAL METHODS =====
  setBasketValue(): void {
    this.basketService.addItemToBasket(this.Product);
    this.toastService.success(
      'Added to Cart',
      `${this.Product.name} has been added to your cart`
    );
  }

  getArrayofRating(rating: number = 5): number[] {
    const validRating = rating || 5;
    return Array(Math.floor(validRating)).fill(0);
  }

  calculateDiscount(oldPrice: number, newPrice: number): number {
    if (!oldPrice || !newPrice || oldPrice <= newPrice) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  }

  hasPhotos(): boolean {
    return !!this.Product?.photos && this.Product.photos.length > 0;
  }

  getMainImage(): string {
    if (this.hasPhotos()) {
      return 'https://localhost:7293/' + this.Product.photos[0].imageName;
    }
    return 'assets/images/placeholder-image.jpg';
  }

  hasDiscount(): boolean {
    return this.Product?.oldPrice > this.Product?.newPrice;
  }

  // ===== MINIMAL NEW METHODS =====
  hasMultipleImages(): boolean {
    return this.hasPhotos() && this.Product.photos.length > 1;
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isFavorited = !this.isFavorited;

    const message = this.isFavorited ? 'Added to favorites' : 'Removed from favorites';
    this.toastService.info('Favorites', message);
  }

  shareProduct(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (navigator.share) {
      navigator.share({
        title: this.Product.name,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.toastService.success('Link Copied', 'Product link copied to clipboard');
      });
    }
  }
  navigateToProductDetails(): void {
    if (this.Product?.id) {
      console.log('🔄 Navigating to product:', this.Product.id);
      this.router.navigate(['/product-details', this.Product.id]);
    } else {
      console.error('❌ Product ID is missing');
    }
  }
}