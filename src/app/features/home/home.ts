import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, HostListener, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  isNew: boolean;
  isFeatured: boolean;
  tags: string[];
}

interface Category {
  id: number;
  name: string;
  icon: string;
  image: string;
  productCount: number;
  color: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  location: string;
}

interface Promotion {
  id: number;
  title: string;
  subtitle: string;
  discount: string;
  image: string;
  color: string;
  expires: Date;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home  implements OnInit {
  @ViewChild('heroSection') heroSection!: ElementRef;

  scrollY = signal(0);
  isVisible = signal(false);
  activeCategory = signal('all');
  searchQuery = signal('');
  isSearchOpen = signal(false);

  // بيانات المنتجات
  featuredProducts: Product[] = [
    {
      id: 1,
      name: 'Sofia Luxury Sofa',
      category: 'Living Room',
      price: 2499,
      oldPrice: 2999,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
      rating: 4.9,
      isNew: true,
      isFeatured: true,
      tags: ['Luxury', 'Modern', 'Comfort']
    },
    {
      id: 2,
      name: 'Elegant Dining Table',
      category: 'Dining Room',
      price: 1899,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
      rating: 4.7,
      isNew: false,
      isFeatured: true,
      tags: ['Elegant', 'Wood', 'Family']
    },
    {
      id: 3,
      name: 'Modern Bed King',
      category: 'Bedroom',
      price: 3299,
      oldPrice: 3799,
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80',
      rating: 4.8,
      isNew: true,
      isFeatured: true,
      tags: ['Modern', 'Comfort', 'King Size']
    },
    {
      id: 4,
      name: 'Designer Bookshelf',
      category: 'Office',
      price: 899,
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&q=80',
      rating: 4.6,
      isNew: false,
      isFeatured: true,
      tags: ['Designer', 'Storage', 'Modern']
    },
    {
      id: 5,
      name: 'Cozy Armchair',
      category: 'Living Room',
      price: 699,
      oldPrice: 899,
      image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80',
      rating: 4.5,
      isNew: true,
      isFeatured: true,
      tags: ['Cozy', 'Comfort', 'Reading']
    },
    {
      id: 6,
      name: 'Minimalist Desk',
      category: 'Office',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80',
      rating: 4.7,
      isNew: false,
      isFeatured: true,
      tags: ['Minimalist', 'Work', 'Modern']
    }
  ];

  // التصنيفات
  categories: Category[] = [
    {
      id: 1,
      name: 'Living Room',
      icon: '🛋️',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
      productCount: 156,
      color: '#8f7347'
    },
    {
      id: 2,
      name: 'Bedroom',
      icon: '🛏️',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80',
      productCount: 89,
      color: '#755a35'
    },
    {
      id: 3,
      name: 'Dining Room',
      icon: '🍽️',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
      productCount: 67,
      color: '#a88c5e'
    },
    {
      id: 4,
      name: 'Office',
      icon: '💼',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80',
      productCount: 45,
      color: '#5c4528'
    },
    {
      id: 5,
      name: 'Outdoor',
      icon: '🌿',
      image: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400&q=80',
      productCount: 34,
      color: '#42301c'
    },
    {
      id: 6,
      name: 'Decor',
      icon: '🎨',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80',
      productCount: 123,
      color: '#bfa57d'
    }
  ];

  // آراء العملاء
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Interior Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80',
      rating: 5,
      comment: 'Dar Elite transformed my entire living space. The quality and design are exceptional!',
      location: 'Cairo, Egypt'
    },
    {
      id: 2,
      name: 'Ahmed Hassan',
      role: 'Home Owner',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
      rating: 5,
      comment: 'Best furniture shopping experience ever. The pieces are even more beautiful in person.',
      location: 'Alexandria, Egypt'
    },
    {
      id: 3,
      name: 'Layla Mohamed',
      role: 'Architect',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
      rating: 4.5,
      comment: 'Perfect blend of modern design and traditional craftsmanship. Highly recommended!',
      location: 'Giza, Egypt'
    }
  ];

  // العروض الترويجية
  promotions: Promotion[] = [
    {
      id: 1,
      title: 'Summer Collection',
      subtitle: 'Refresh your space',
      discount: '30% OFF',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
      color: '#a88c5e',
      expires: new Date('2024-08-30')
    },
    {
      id: 2,
      title: 'Luxury Bedroom',
      subtitle: 'Dream in style',
      discount: '25% OFF',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80',
      color: '#8f7347',
      expires: new Date('2024-09-15')
    },
    {
      id: 3,
      title: 'Office Setup',
      subtitle: 'Work from home in comfort',
      discount: '20% OFF',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80',
      color: '#755a35',
      expires: new Date('2024-08-25')
    }
  ];

  // إحصائيات
  stats = [
    { number: '10K+', label: 'Happy Customers', icon: '😊' },
    { number: '15+', label: 'Years Experience', icon: '⭐' },
    { number: '50+', label: 'Awards Won', icon: '🏆' },
    { number: '500+', label: 'Unique Designs', icon: '🎨' }
  ];

  ngOnInit() {
    setTimeout(() => this.isVisible.set(true), 100);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollY.set(window.scrollY);
  }

  // وظائف المساعدة للحركات
  getParallaxTransform(): string {
    const yOffset = this.scrollY() * 0.5;
    return `translateY(${yOffset}px)`;
  }

  getStaggerDelay(index: number): string {
    return (index * 0.1) + 's';
  }

  setActiveCategory(category: string) {
    this.activeCategory.set(category);
  }

  toggleSearch() {
    this.isSearchOpen.set(!this.isSearchOpen());
  }

  get filteredProducts() {
    const query = this.searchQuery().toLowerCase();
    const category = this.activeCategory();
    
    return this.featuredProducts.filter(product => {
      const matchesSearch = !query || 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query));
      
      const matchesCategory = category === 'all' || product.category === category;
      
      return matchesSearch && matchesCategory;
    });
  }

  getDaysUntil(date: Date): number {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // وظائف التقييم
  getStarArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  getDiscountPercentage(oldPrice: number, newPrice: number): string {
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100) + '%';
  }
}