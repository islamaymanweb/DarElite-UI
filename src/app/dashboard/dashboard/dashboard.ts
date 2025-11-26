import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  
  today: Date = new Date();
  
  // Statistics data
  stats = {
    totalOrders: 1247,
    totalProducts: 89,
    totalCategories: 12,
    totalRevenue: 45620,
    ordersGrowth: 12.5,
    productsGrowth: 8.2,
    revenueGrowth: 15.3
  };

  // Recent activities
  recentActivities = [
    {
      id: 1,
      type: 'order',
      message: 'New order #1234 received',
      time: '2 minutes ago',
      icon: '🛒',
      color: 'success'
    },
    {
      id: 2,
      type: 'product',
      message: 'Product "Wireless Headphones" updated',
      time: '1 hour ago',
      icon: '📱',
      color: 'info'
    },
    {
      id: 3,
      type: 'category',
      message: 'New category "Electronics" added',
      time: '3 hours ago',
      icon: '📂',
      color: 'warning'
    },
    {
      id: 4,
      type: 'user',
      message: 'Customer John Doe registered',
      time: '5 hours ago',
      icon: '👤',
      color: 'primary'
    }
  ];

  // Quick actions
  quickActions = [
    {
      title: 'Manage Products',
      description: 'Add, edit or remove products',
      icon: '📦',
      link: '/products',
      color: 'primary'
    },
    {
      title: 'Categories',
      description: 'Organize product categories',
      icon: '📁',
      link: '/categories',
      color: 'success'
    },
    {
      title: 'View Orders',
      description: 'Process customer orders',
      icon: '🛒',
      link: '/orders',
      color: 'warning'
    },
    {
      title: 'Analytics',
      description: 'View sales reports',
      icon: '📊',
      link: '/analytics',
      color: 'info'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // In a real application, you would fetch actual data here
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Simulate API calls to load real data
    // this.dashboardService.getStats().subscribe(...);
    // this.dashboardService.getRecentActivities().subscribe(...);
  }

  getGrowthClass(growth: number): string {
    return growth >= 0 ? 'positive' : 'negative';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Helper method to get absolute value for growth percentages
  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  // Helper method to get growth arrow
  getGrowthArrow(growth: number): string {
    return growth >= 0 ? '↗' : '↘';
  }
}