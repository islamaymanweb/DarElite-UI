// footer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class Footer  {
  // Company information - used for display purposes
  readonly companyInfo = {
    name: 'Dar Elite',
    description: 'Crafting timeless elegance for your home with premium furniture that blends traditional craftsmanship with modern design.',
    address: '123 Design District, Cairo, Egypt',
    phone: '+20 100 123 4567',
    email: 'hello@darelite.com',
    workingHours: 'Sun - Thu: 9:00 AM - 9:00 PM'
  };

  // Quick navigation links
  readonly quickLinks = [
    { label: 'Home', route: '/' },
    { label: 'Shop', route: '/shop' },
    { label: 'Categories', route: '/categories' },
    { label: 'About', route: '/about' },
    { label: 'Contact', route: '/contact' }
  ];

  // Social media links
  readonly socialMedia = [
    { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/darelite' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/darelite' },
    { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/darelite' },
    { name: 'Pinterest', icon: 'pinterest', url: 'https://pinterest.com/darelite' }
  ];

  constructor() {
    // No logic changes - component is purely presentational
  }
}