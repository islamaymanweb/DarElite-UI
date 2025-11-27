import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, OnInit, signal, ViewChild, viewChild } from '@angular/core';
 
import { ICateogry } from '../../../core/models/Category ';
import { IProduct } from '../../../core/models/Product';
 
import { IPagnation } from '../../../core/models/Pagnation';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShopItem } from '../shop-item/shop-item';
import { Pagination } from '../../../core/Component/pagnation/pagnation';
import { Spinner } from '../../../core/Component/spinner/spinner';
import { ShopService } from '../../../core/services/shop-service';
import { ToastService } from '../../../core/services/toast-service';
import { ProductParams } from '../../../core/models/ProductParam';
import { HttpParams } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
 
 
@Component({
  selector: 'app-shop',
  imports: [ CommonModule, 
    RouterModule, 
    FormsModule, 
    ShopItem, 
 Pagination,
 Spinner
   ],
  templateUrl: './shoppage.html',
  styleUrl: './shoppage.scss',
})
 
export class ShopPage implements OnInit, AfterViewInit, OnDestroy {
  private shopService = inject(ShopService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  @ViewChild('mobileSearch') mobileSearchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('desktopSearch') desktopSearchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('sortSelect') sortSelect!: ElementRef<HTMLSelectElement>;

  // Signals
  products = signal<IProduct[]>([]);
  categories = signal<ICateogry[]>([]);
  totalCount = signal<number>(0);
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  searchTerm = signal<string>('');
  isMobileFiltersOpen = signal<boolean>(false);
viewMode = signal<'grid' | 'list'>('grid');
isGridActive = signal<boolean>(true);
isListActive = signal<boolean>(false);

  // Search debounce
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  // Product Parameters
  ProductParam = new ProductParams();
  
  // Sorting Options
  SortingOption = [
    { name: 'Name', value: 'Name' },
    { name: 'Price: Low to High', value: 'PriceAce' },
    { name: 'Price: High to Low', value: 'PriceDce' },
  ];

  ngOnInit(): void {
    console.log('🏪 Shop Component Initialized');
    this.setupSearchDebounce();
    this.getAllProduct();
    this.getCategory();
  }

  ngAfterViewInit(): void {
    this.setupMobileBehavior();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.closeMobileFilters();
  }

  // ===== Search Functionality =====
  private setupSearchDebounce(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.performSearch(searchTerm);
      });
  }

  onSearchInput(searchValue: string): void {
    this.searchTerm.set(searchValue);
    this.searchSubject.next(searchValue);
  }

  OnSearch(search: string): void {
    console.log('🔍 Performing search:', search);
    this.searchTerm.set(search);
    
    if (search && search.trim() !== '') {
      this.toastService.info('Searching...', `Searching for "${search}"`);
    }
    
    this.performSearch(search);
  }

  private performSearch(search: string): void {
    this.ProductParam.Search = search.trim() === '' ? 'a' : search.trim();
    this.ProductParam.PageNumber = 1;
    this.getAllProduct();
  }

  // ===== Mobile Filters =====
  toggleMobileFilters(): void {
    const newState = !this.isMobileFiltersOpen();
    this.isMobileFiltersOpen.set(newState);
    
    if (newState) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }

  closeMobileFilters(): void {
    this.isMobileFiltersOpen.set(false);
    document.body.classList.remove('sidebar-open');
  }

  // ===== Product Loading =====
  getAllProduct(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    
    console.log('📦 Fetching products with params:', {
      search: this.ProductParam.Search,
      category: this.ProductParam.CategoryId,
      sort: this.ProductParam.Sort,
      page: this.ProductParam.PageNumber
    });

    this.shopService.getProduct(this.ProductParam).subscribe({
      next: (value: IPagnation) => {
        console.log('✅ Products loaded successfully:', value);
        
        this.products.set(value?.data || []);
        this.totalCount.set(value?.totalCount || 0);
        this.ProductParam.PageNumber = value?.pageNumber || 1;
        this.ProductParam.pageSize = value?.pageSize || 6;
        this.isLoading.set(false);
        
        // Only show toast if no products found or if it's a search/filter result
        if (value?.data && value.data.length === 0) {
          if (this.ProductParam.Search && this.ProductParam.Search !== 'a') {
            this.toastService.info('No Results', `No products found matching "${this.ProductParam.Search}"`);
          } else if (this.ProductParam.CategoryId && this.ProductParam.CategoryId !== 0) {
            this.toastService.info('No Products', 'No products found in this category');
          }
        }
      },
      error: (error) => {
        console.error('❌ Error loading products:', error);
        this.isLoading.set(false);
        this.hasError.set(true);
        this.products.set([]);
        this.totalCount.set(0);
        this.toastService.error('Error', 'Failed to load products');
      }
    });
  }

  // ===== Filtering & Sorting =====
  onCategorySelect(categoryId: number): void {
    console.log('🏷️ Category selected:', categoryId);
    this.ProductParam.CategoryId = categoryId;
    this.ProductParam.PageNumber = 1;
    this.closeMobileFilters();
    
    const category = this.categories().find(c => c.id === categoryId);
    if (category) {
      this.toastService.info('Filter Applied', `Showing products from ${category.name} category`);
    }
    
    this.getAllProduct();
  }

  onSortChange(event: Event): void {
    const sortValue = (event.target as HTMLSelectElement).value;
    console.log('🔽 Sorting by:', sortValue);
    this.ProductParam.Sort = sortValue;
    this.ProductParam.PageNumber = 1;
    
    const sortOption = this.SortingOption.find(opt => opt.value === sortValue);
    if (sortOption) {
      this.toastService.info('Sorting Applied', `Products sorted by ${sortOption.name}`);
    }
    
    this.getAllProduct();
  }

   
  resetAllFilters(): void {
    console.log('🔄 Resetting all filters');
    
    this.ProductParam.Search = 'a';
    this.ProductParam.Sort = this.SortingOption[0].value;
    this.ProductParam.CategoryId = 0;
    this.ProductParam.PageNumber = 1;
    this.searchTerm.set('');
    
    this.toastService.info('Filters Reset', 'All filters have been cleared. Showing all products.');
 
    if (this.mobileSearchInput) {
      this.mobileSearchInput.nativeElement.value = '';
    }
    if (this.desktopSearchInput) {
      this.desktopSearchInput.nativeElement.value = '';
    }
    if (this.sortSelect) {
      this.sortSelect.nativeElement.value = this.SortingOption[0].value;
    }

    this.closeMobileFilters();
    this.getAllProduct();
  }
 
  getCategory(): void {
    this.shopService.getCategory().subscribe({
      next: (categories) => {
        console.log('✅ Categories loaded:', categories);
        this.categories.set(categories || []);
      },
      error: (error) => {
        console.error('❌ Error loading categories:', error);
        this.categories.set([]);
        this.toastService.error('Error', 'Failed to load categories');
      }
    });
  }
 
  OnChangePage(pageNumber: number): void {
    console.log('📄 Page changed to:', pageNumber);
    if (this.ProductParam.PageNumber !== pageNumber) {
      this.ProductParam.PageNumber = pageNumber;
      this.getAllProduct();
       
      this.scrollToProducts();
    }
  }

  private scrollToProducts(): void {
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

 
  private setupMobileBehavior(): void {
 
    document.addEventListener('click', (event) => {
      if (this.isMobileFiltersOpen() && window.innerWidth <= 1024) {
        const sidebar = document.querySelector('.luxury-sidebar');
        const filterToggle = document.querySelector('.filter-toggle');
        
        if (sidebar && !sidebar.contains(event.target as Node) && 
            filterToggle && !filterToggle.contains(event.target as Node)) {
          this.closeMobileFilters();
        }
      }
    });
 
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    if (window.innerWidth > 1024 && this.isMobileFiltersOpen()) {
      this.closeMobileFilters();
    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories().find(cat => cat.id === categoryId);
    return category ? category.name : 'All Collections';
  }

  getSortName(sortValue: string): string {
    const sortOption = this.SortingOption.find(option => option.value === sortValue);
    return sortOption ? sortOption.name : 'Default Sort';
  }

  hasProducts(): boolean {
    return this.products().length > 0 && !this.isLoading() && !this.hasError();
  }

  hasNoResults(): boolean {
    return this.products().length === 0 && !this.isLoading() && !this.hasError();
  }
 
  SelectedId(categoryId: number): void {
    this.onCategorySelect(categoryId);
  }

  SortingByPrice(event: Event): void {
    this.onSortChange(event);
  }

  ResetValue(): void {
    this.resetAllFilters();
  }
  
 
setViewMode(mode: 'grid' | 'list'): void {
  console.log('🎯 Setting view mode to:', mode);
  this.viewMode.set(mode);
  
 
  const buttons = document.querySelectorAll('.view-option');
  buttons.forEach(btn => {
    const title = btn.getAttribute('title');
    if (title === `${mode} View`) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}
}