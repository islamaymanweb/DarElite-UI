 
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface SocialMedia {
  name: string;
  icon: string;
  url: string;
  color: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class Footer  implements OnInit {
  currentYear = signal(new Date().getFullYear());
  isVisible = signal(false);

  // بيانات الشركة
  companyInfo = {
    name: 'Dar Elite',
    description: 'Crafting timeless elegance for your home with premium furniture that blends traditional craftsmanship with modern design.',
    address: '123 Design District, Cairo, Egypt',
    phone: '+20 100 123 4567',
    email: 'hello@darelite.com',
    workingHours: 'Sun - Thu: 9:00 AM - 9:00 PM'
  };

  // روابط سريعة
  quickLinks: FooterLink[] = [
    { label: 'Living Room', href: '/shop?category=living-room' },
    { label: 'Bedroom', href: '/shop?category=bedroom' },
    { label: 'Dining Room', href: '/shop?category=dining-room' },
    { label: 'Office', href: '/shop?category=office' },
    { label: 'Outdoor', href: '/shop?category=outdoor' },
    { label: 'Decor', href: '/shop?category=decor' }
  ];

  // خدمات
  services: FooterLink[] = [
    { label: 'Design Consultation', href: '/services/design' },
    { label: 'Custom Furniture', href: '/services/custom' },
    { label: 'Installation', href: '/services/installation' },
    { label: 'Delivery', href: '/services/delivery' },
    { label: 'Warranty', href: '/services/warranty' },
    { label: 'Maintenance', href: '/services/maintenance' }
  ];

  // معلومات
  information: FooterLink[] = [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Sustainability', href: '/sustainability' }
  ];

  
  support: FooterLink[] = [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '/contact' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'Track Order', href: '/track-order' }
  ];

   
  socialMedia: SocialMedia[] = [
    { 
      name: 'Facebook', 
      icon: '📘', 
      url: 'https://facebook.com/darelite', 
      color: '#1877F2' 
    },
    { 
      name: 'Instagram', 
      icon: '📷', 
      url: 'https://instagram.com/darelite', 
      color: '#E4405F' 
    },
     
     
    { 
      name: 'YouTube', 
      icon: '📺', 
      url: 'https://youtube.com/darelite', 
      color: '#FF0000' 
    }
  ];

 
  paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'MasterCard', icon: '💳' },
    { name: 'PayPal', icon: '🔵' },
    { name: 'Bank Transfer', icon: '🏦' }
  ];
 
  trustBadges = [
    { label: 'Secure Payment', icon: '🔒' },
    { label: 'SSL Encrypted', icon: '🛡️' },
    { label: 'Quality Guarantee', icon: '⭐' },
    { label: 'Free Shipping', icon: '🚚' }
  ];

  ngOnInit() {
    
    setTimeout(() => this.isVisible.set(true), 100);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getStaggerDelay(index: number): string {
    return (index * 0.1) + 's';
  }
}