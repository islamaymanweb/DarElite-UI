/*  import { Component, HostListener, OnInit, signal, ElementRef, ViewChild, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BasketService } from '../../core/services/basket-service';
import { ToastService } from '../../core/services/toast-service';
import { CoreService, User } from '../../core/services/core-service';
import { IBasket } from '../../core/models/Basket';
import { FormsModule } from '@angular/forms';
import { AdminCheckResponse } from '../../core/models/admin';
import { AdminService } from '../../core/services/admin-service';
 
interface NavigationLink {
  label: string;
  path: string;
  icon: string;
}

interface UserMenuItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar  implements OnInit, OnDestroy {
  private basketService = inject(BasketService);
  private coreService = inject(CoreService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
private adminService =inject(AdminService)
  // Signals
  basket = signal<IBasket | null>(null);
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isUserDropdownOpen = signal(false);
  isCartDropdownOpen = signal(false);
  isVisible = signal(false);
  cartItemCount = signal(0);
  isLoggedIn = signal(false);
  userName = signal('');
  userEmail = signal('');
  userInitials = signal('');
    isAdmin = signal(false);
adminMenuItems = signal<UserMenuItem[]>([]);
isCheckingAdmin = signal(false);
  indicatorTransform = signal('translateX(0) scaleX(0)');
  
  @ViewChild('mobileSidebar') mobileSidebar!: ElementRef<HTMLElement>;
  
  private activeLinkIndex = 0;

 
navigationLinks = [
  { label: 'Home', path: '/', icon: '🏘' },
  { label: 'Shop', path: '/shop', icon: '👜' },
  { label: 'About', path: '/about', icon: '❕' },
  { label: 'Contact', path: '/contact', icon: '✉' },
];



  userMenuItems: UserMenuItem[] = [
    
    { label: 'My Orders', path: '/account/orders', icon: '📦' },
    { label: 'Wishlist', path: '/wishlist', icon: '❤️' },
    
  ];

  ngOnInit() {
    setTimeout(() => this.isVisible.set(true), 100);
    
    this.loadBasket();
    this.setupUserSubscription();
    this.setupNavigationIndicator();
   this.checkAdminStatus();
 
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // إعداد اشتراك حالة المستخدم
  private setupUserSubscription(): void {
    // تحميل الحالة الأولية مباشرة
    const currentUser = this.coreService.getCurrentUser();
    if (currentUser) {
      this.updateUserState(currentUser);
    }
    
    // الاستماع للتغييرات
    this.coreService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        console.log('Navbar: User state changed:', user);
        this.updateUserState(user);
      });
  }

  // تحديث حالة المستخدم
  private updateUserState(user: User | null): void {
    console.log('Navbar: Updating user state:', user);
    this.isLoggedIn.set(!!user);
    this.userName.set(user?.displayName || user?.userName || '');
    this.userEmail.set(user?.email || '');
    this.userInitials.set(this.coreService.getUserInitials());
    console.log('Navbar: Updated state - isLoggedIn:', this.isLoggedIn(), 'userName:', this.userName());
  }

  // تحميل سلة التسوق
  loadBasket() {
    this.basketService.basket$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (basket) => {
          this.basket.set(basket);
          this.cartItemCount.set(basket?.basketItems?.length || 0);
        }
      });
  }

  // Event Listeners
  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.handleUserDropdownClick(event);
    this.handleSidebarClickOutside(event);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
    if (this.isUserDropdownOpen()) {
      this.closeUserDropdown();
    }
  }

  // Click Outside Handlers
  private handleUserDropdownClick(event: Event) {
    if (!(event.target as HTMLElement).closest('.user-dropdown')) {
      this.closeUserDropdown();
    }
  }

  private handleSidebarClickOutside(event: Event) {
    if (this.isMobileMenuOpen() && this.mobileSidebar) {
      const target = event.target as HTMLElement;
      const sidebarElement = this.mobileSidebar.nativeElement;
      const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      
      if (!sidebarElement.contains(target) && !mobileMenuBtn?.contains(target)) {
        this.closeMobileMenu();
      }
    }
  }

  // Mobile Menu Methods
  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
    if (this.isMobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  // User Dropdown Methods
  toggleUserDropdown() {
    this.isUserDropdownOpen.update(val => !val);
  }

  closeUserDropdown() {
    this.isUserDropdownOpen.set(false);
  }

  // Logout Handler
  handleLogout() {
    this.coreService.logout().subscribe({
      next: () => {
        this.toast.success('Logged out successfully', 'Goodbye!');
        this.closeUserDropdown();
        this.closeMobileMenu();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.toast.error('Logout failed', 'Please try again');
        // Force clear local data even if API call fails
        this.coreService.clearUserData();
      }
    });
  }

  // Navigation Methods
  handleNavigation() {
    this.closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onLinkHover(event: MouseEvent, link: NavigationLink) {
    const index = this.navigationLinks.findIndex(l => l.path === link.path);
    this.activeLinkIndex = index;
    this.updateNavigationIndicator();
  }

  setupNavigationIndicator() {
    this.updateNavigationIndicator();
  }

  updateNavigationIndicator() {
    const linkWidth = 100 / this.navigationLinks.length;
    const transform = `translateX(${this.activeLinkIndex * linkWidth}%) scaleX(${linkWidth / 100})`;
    this.indicatorTransform.set(transform);
  }

  // Helper methods for template
  getUserName(): string {
    return this.userName();
  }

  getUserEmail(): string {
    return this.userEmail();
  }

  getUserInitials(): string {
    return this.userInitials();
  }
 
private checkAdminStatus(): void {
  this.isCheckingAdmin.set(true);
  
  this.adminService.isAdmin().subscribe({
    next: (response: AdminCheckResponse) => {
      console.log('Admin check response:', response);
      this.isAdmin.set(response.isAdmin === true);
      this.isCheckingAdmin.set(false);
    },
    error: (error) => {
      console.error('Error checking admin status:', error);
      this.isAdmin.set(false);
      this.isCheckingAdmin.set(false);
    }
  });
}

// تحديث دالة canAccessAdmin
canAccessAdmin(): boolean {
  return this.isLoggedIn() && this.isAdmin() && !this.isCheckingAdmin();
}

// تحديث navigationLinksWithAdmin
get navigationLinksWithAdmin(): NavigationLink[] {
  const baseLinks = this.navigationLinks;
  
  if (this.canAccessAdmin()) {
    return [
      ...baseLinks,
      { label: 'Dashboard', path: '/dashboard', icon: '📊' },
      { label: 'Products', path: '/products', icon: '📦' }
    ];
  }
  
  return baseLinks;
}
} */

import { Component, HostListener, OnInit, signal, ElementRef, ViewChild, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BasketService } from '../../core/services/basket-service';
import { ToastService } from '../../core/services/toast-service';
import { CoreService, User } from '../../core/services/core-service';
import { IBasket } from '../../core/models/Basket';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin-service';
import { AdminCheckResponse } from '../../core/models/admin';

interface NavigationLink {
  label: string;
  path: string;
  icon: string;
}

interface UserMenuItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar implements OnInit, OnDestroy {
  private basketService = inject(BasketService);
  private coreService = inject(CoreService);
  private adminService = inject(AdminService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  // Signals
  basket = signal<IBasket | null>(null);
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isUserDropdownOpen = signal(false);
  isCartDropdownOpen = signal(false);
  isVisible = signal(false);
  cartItemCount = signal(0);
  isLoggedIn = signal(false);
  isAdmin = signal(false);
  isCheckingAdmin = signal(false);
  userName = signal('');
  userEmail = signal('');
  userInitials = signal('');
  
  adminMenuItems = signal<UserMenuItem[]>([]);
  indicatorTransform = signal('translateX(0) scaleX(0)');
  
  @ViewChild('mobileSidebar') mobileSidebar!: ElementRef<HTMLElement>;
  
  private activeLinkIndex = 0;

  // Data
  navigationLinks: NavigationLink[] = [
    { label: 'Home', path: '/', icon: '🏘' },
    { label: 'Shop', path: '/shop', icon: '👜' },
    { label: 'About', path: '/about', icon: '❕' },
    { label: 'Contact', path: '/contact', icon: '✉' },
  ];

  userMenuItems: UserMenuItem[] = [
 
    { label: 'My Orders', path: '/orders', icon: '📦' },
    { label: 'Wishlist', path: '/wishlist', icon: '❤️' },
 
  ];

  ngOnInit() {
    setTimeout(() => this.isVisible.set(true), 100);
    
    this.loadBasket();
    this.setupUserSubscription();
    this.setupAdminMenu();
    this.setupNavigationIndicator();
    
    console.log('Navbar initialized');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // إعداد اشتراك حالة المستخدم
  private setupUserSubscription(): void {
    // تحميل الحالة الأولية مباشرة
    const currentUser = this.coreService.getCurrentUser();
    console.log('Current user from coreService:', currentUser);
    
    if (currentUser) {
      this.updateUserState(currentUser);
    }
    
    // الاستماع للتغييرات
    this.coreService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        console.log('Navbar: User state changed:', user);
        this.updateUserState(user);
      });
  }

  // تحديث حالة المستخدم
  private updateUserState(user: User | null): void {
    console.log('Navbar: Updating user state:', user);
    this.isLoggedIn.set(!!user);
    this.userName.set(user?.displayName || user?.userName || '');
    this.userEmail.set(user?.email || '');
    this.userInitials.set(this.coreService.getUserInitials());
    
    console.log('Navbar: Updated state - isLoggedIn:', this.isLoggedIn(), 'userName:', this.userName());
    
    // إذا كان هناك مستخدم جديد، تحقق من صلاحيات الأدمن
    if (user) {
      this.checkAdminStatus();
    } else {
      this.isAdmin.set(false);
      this.isCheckingAdmin.set(false);
      this.setupAdminMenu();
    }
  }

  // التحقق من صلاحية الأدمن
  private checkAdminStatus(): void {
    console.log('Checking admin status...');
    this.isCheckingAdmin.set(true);
    
    this.adminService.isAdmin().subscribe({
      next: (response: AdminCheckResponse) => {
        console.log('Admin check response:', response);
        this.isAdmin.set(response.isAdmin === true);
        this.isCheckingAdmin.set(false);
        this.setupAdminMenu();
        
        console.log('Admin status finalized - isAdmin:', this.isAdmin(), 'isCheckingAdmin:', this.isCheckingAdmin());
      },
      error: (error) => {
        console.error('Error checking admin status:', error);
        this.isAdmin.set(false);
        this.isCheckingAdmin.set(false);
        this.setupAdminMenu();
        
        console.log('Admin check error - isAdmin:', this.isAdmin(), 'isCheckingAdmin:', this.isCheckingAdmin());
      }
    });
  }

  // إعداد قائمة الأدمن
  private setupAdminMenu(): void {
    const adminItems: UserMenuItem[] = [
      { label: 'Dashboard', path: '/dashboard', icon: '📊' },
      { label: 'Categories', path: '/categories', icon: '📁' },
      { label: 'Products', path: '/products', icon: '📦' },
      { label: 'Admins', path: '/admin', icon: '👥' }
    ];
    
    this.adminMenuItems.set(adminItems);
    console.log('Admin menu setup - items:', adminItems, 'canAccessAdmin:', this.canAccessAdmin());
  }

  // دالة مساعدة للتحقق من الصلاحيات
  canAccessAdmin(): boolean {
    const canAccess = this.isLoggedIn() && this.isAdmin() && !this.isCheckingAdmin();
    console.log('canAccessAdmin check:', {
      isLoggedIn: this.isLoggedIn(),
      isAdmin: this.isAdmin(),
      isCheckingAdmin: this.isCheckingAdmin(),
      result: canAccess
    });
    return canAccess;
  }

  // الحصول على روابط التنقل مع إضافة روابط الأدمن إذا كان مسؤولاً
  get navigationLinksWithAdmin(): NavigationLink[] {
    const baseLinks = this.navigationLinks;
    
    if (this.canAccessAdmin()) {
      const linksWithAdmin = [
        ...baseLinks,
        { label: 'Dashboard', path: '/dashboard', icon: '📊' },
        { label: 'Products', path: '/products', icon: '📦' }
      ];
      console.log('Navigation links with admin:', linksWithAdmin);
      return linksWithAdmin;
    }
    
    console.log('Navigation links without admin:', baseLinks);
    return baseLinks;
  }

  // تحميل سلة التسوق
  loadBasket() {
    this.basketService.basket$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (basket) => {
          this.basket.set(basket);
          this.cartItemCount.set(basket?.basketItems?.length || 0);
        }
      });
  }

  // باقي الدوال كما هي...
  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.handleUserDropdownClick(event);
    this.handleSidebarClickOutside(event);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
    if (this.isUserDropdownOpen()) {
      this.closeUserDropdown();
    }
  }

  // Click Outside Handlers
  private handleUserDropdownClick(event: Event) {
    if (!(event.target as HTMLElement).closest('.user-dropdown')) {
      this.closeUserDropdown();
    }
  }

  private handleSidebarClickOutside(event: Event) {
    if (this.isMobileMenuOpen() && this.mobileSidebar) {
      const target = event.target as HTMLElement;
      const sidebarElement = this.mobileSidebar.nativeElement;
      const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      
      if (!sidebarElement.contains(target) && !mobileMenuBtn?.contains(target)) {
        this.closeMobileMenu();
      }
    }
  }

  // Mobile Menu Methods
  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
    if (this.isMobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  // User Dropdown Methods
  toggleUserDropdown() {
    this.isUserDropdownOpen.update(val => !val);
  }

  closeUserDropdown() {
    this.isUserDropdownOpen.set(false);
  }

  // Logout Handler
  handleLogout() {
    this.coreService.logout().subscribe({
      next: () => {
        this.toast.success('Logged out successfully', 'Goodbye!');
        this.closeUserDropdown();
        this.closeMobileMenu();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.toast.error('Logout failed', 'Please try again');
        // Force clear local data even if API call fails
        this.coreService.clearUserData();
      }
    });
  }

  // Navigation Methods
  handleNavigation() {
    this.closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onLinkHover(event: MouseEvent, link: NavigationLink) {
    const index = this.navigationLinks.findIndex(l => l.path === link.path);
    this.activeLinkIndex = index;
    this.updateNavigationIndicator();
  }

  setupNavigationIndicator() {
    this.updateNavigationIndicator();
  }

  updateNavigationIndicator() {
    const linkWidth = 100 / this.navigationLinks.length;
    const transform = `translateX(${this.activeLinkIndex * linkWidth}%) scaleX(${linkWidth / 100})`;
    this.indicatorTransform.set(transform);
  }

  // Helper methods for template
  getUserName(): string {
    return this.userName();
  }

  getUserEmail(): string {
    return this.userEmail();
  }

  getUserInitials(): string {
    return this.userInitials();
  }
}