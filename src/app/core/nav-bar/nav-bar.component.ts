import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasketService } from '../../basket/basket.service';
import { Observable } from 'rxjs';
import { IBasket } from '../../shared/Models/Basket';
import { CoreService } from '../core.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
login() {
throw new Error('Method not implemented.');
}
  isMenuOpen = false;
  isUserDropdownOpen = false;
  basket$: Observable<IBasket | null>;
  username$ = this.coreService.userName$;
  isLoggedIn$ = this.coreService.isLoggedIn$;

  constructor(
    public basketService: BasketService,
    private router: Router,
    private coreService: CoreService
  ) {
    this.basket$ = this.basketService.basket$;
  }

  ngOnInit() {
    this.coreService.checkLoginStatus();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 992 && this.isMenuOpen) {
      this.toggleMenu();
    }
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  logout() {
    this.coreService.logout().subscribe({
      next: () => {
        this.isUserDropdownOpen = false;
        this.router.navigateByUrl('/');
      }
    });
  }
}