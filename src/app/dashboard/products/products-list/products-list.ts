// src/app/components/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
import { ICateogry } from '../../../core/models/Category ';
import { IProduct } from '../../../core/models/Product';
import { AddProductDTO, AdminProductService, UpdateProductDTO } from '../../../core/services/admin-product-service';
import { ShopService } from '../../../core/services/shop-service';
import { environment } from '../../../../environments/environment';
 
 
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule,CurrencyPipe],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.scss']
})
export class ProductList  implements OnInit {
     products: IProduct[] = [];
  categories: ICateogry[] = [];
  showAddForm = false;
  showEditForm = false;
  selectedProduct: IProduct | null = null;
  
  environment = environment;

  newProduct: AddProductDTO = {
    name: '',
    description: '',
    newPrice: 0,
    oldPrice: 0,
    categoryId: 0,
    photo: null as any
  };

  editProduct: UpdateProductDTO = {
    id: 0,
    name: '',
    description: '',
    newPrice: 0,
    oldPrice: 0,
    categoryId: 0,
    photo: null as any
  };

  selectedFiles: FileList | null = null;
  editSelectedFiles: FileList | null = null;

  constructor(
    private adminProductService: AdminProductService,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.adminProductService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('📦 Loaded products:', data);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        alert('Error loading products');
      }
    });
  }

  loadCategories(): void {
    this.shopService.getCategory().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onAddSubmit(): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      alert('Please select at least one image');
      return;
    }

    console.log('🖼️ Selected files:', this.selectedFiles);
    
    this.newProduct.photo = this.selectedFiles;
    
    this.adminProductService.addProduct(this.newProduct).subscribe({
      next: (response) => {
        console.log('✅ Product added successfully:', response);
        alert('Product added successfully!');
        this.loadProducts();
        this.showAddForm = false;
        this.resetNewProductForm();
      },
      error: (error) => {
        console.error('❌ Error adding product:', error);
        alert('Error adding product: ' + error.message);
      }
    });
  }

  onEditSubmit(): void {
    if (this.editSelectedFiles && this.editSelectedFiles.length > 0) {
      this.editProduct.photo = this.editSelectedFiles;
    } else {
      this.editProduct.photo = null as any;
    }
    
    this.adminProductService.updateProduct(this.editProduct).subscribe({
      next: (response) => {
        alert('Product updated successfully!');
        this.loadProducts();
        this.showEditForm = false;
        this.selectedProduct = null;
      },
      error: (error) => {
        console.error('Error updating product:', error);
        alert('Error updating product');
      }
    });
  }

  editProductItem(product: IProduct): void {
    this.editProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      newPrice: product.newPrice,
      oldPrice: product.oldPrice,
      categoryId: this.getCategoryIdByName(product.categoryName),
      photo: null as any
    };
    this.showEditForm = true;
    this.showAddForm = false;
    this.editSelectedFiles = null;
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminProductService.deleteProduct(id).subscribe({
        next: (response) => {
          alert('Product deleted successfully!');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Error deleting product');
        }
      });
    }
  }

  showAddProductForm(): void {
    this.showAddForm = true;
    this.showEditForm = false;
    this.selectedProduct = null;
    this.selectedFiles = null;
  }

  cancelForms(): void {
    this.showAddForm = false;
    this.showEditForm = false;
    this.selectedProduct = null;
    this.selectedFiles = null;
    this.editSelectedFiles = null;
    this.resetNewProductForm();
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.selectedFiles = files;
      console.log('📁 Files selected:', files.length);
    }
  }

  onEditFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.editSelectedFiles = files;
    }
  }

  private getCategoryIdByName(categoryName: string): number {
    const category = this.categories.find(cat => cat.name === categoryName);
    return category ? category.id : 0;
  }

  private resetNewProductForm(): void {
    this.newProduct = {
      name: '',
      description: '',
      newPrice: 0,
      oldPrice: 0,
      categoryId: 0,
      photo: null as any
    };
    this.selectedFiles = null;
  }

  // التصحيح هنا - تأكد من أن الدالة دائماً ترجع مصفوفة
  getProductPhotos(product: IProduct): any[] {
    return product.photos || [];
  }

  // دالة مساعدة إضافية للتحقق من وجود الصور
  hasPhotos(product: IProduct): boolean {
    return !!(product.photos && product.photos.length > 0);
  }

  // دالة للحصول على عدد الصور
  getPhotosCount(product: IProduct): number {
    return product.photos ? product.photos.length : 0;
  }
  // أضف هذه الدالة داخل الكلاس AdminProductListComponent
trackByProductId(index: number, product: IProduct): number {
  return product.id;
}
}