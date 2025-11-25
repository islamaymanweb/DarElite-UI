import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About  implements OnInit {
  scrollY = signal(0);
  isVisible = signal(false);
  activeSection = signal('hero');

  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'Founder & CEO',
      bio: 'With over 15 years in interior design, Sarah founded Dar Elite to bring luxury furniture to every home.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
      social: {
        linkedin: '#',
        twitter: '#',
        instagram: '#'
      }
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Head of Design',
      bio: 'Michael brings innovative design concepts and sustainable practices to our furniture collections.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      position: 'Production Manager',
      bio: 'Elena ensures every piece meets our high standards of craftsmanship and quality.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      social: {
        linkedin: '#',
        instagram: '#'
      }
    },
    {
      id: 4,
      name: 'David Kim',
      position: 'Customer Experience Director',
      bio: 'David leads our commitment to exceptional customer service and satisfaction.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    }
  ];

  milestones: Milestone[] = [
    {
      year: '2010',
      title: 'Our Humble Beginning',
      description: 'Started as a small workshop with a passion for quality furniture',
      icon: '🚀'
    },
    {
      year: '2014',
      title: 'First Showroom',
      description: 'Opened our first flagship store in downtown',
      icon: '🏪'
    },
    {
      year: '2018',
      title: 'National Expansion',
      description: 'Expanded to 10 cities across the country',
      icon: '🌍'
    },
    {
      year: '2022',
      title: 'Sustainable Initiative',
      description: 'Committed to 100% sustainable materials',
      icon: '🌱'
    },
    {
      year: '2024',
      title: 'Digital Innovation',
      description: 'Launched AR furniture visualization',
      icon: '📱'
    }
  ];

  values: Value[] = [
    {
      icon: '🎨',
      title: 'Creativity',
      description: 'We push boundaries in design while maintaining timeless elegance',
      color: '#8B5CF6'
    },
    {
      icon: '⭐',
      title: 'Quality',
      description: 'Every piece is crafted with premium materials and attention to detail',
      color: '#F59E0B'
    },
    {
      icon: '🤝',
      title: 'Integrity',
      description: 'We build trust through transparency and honest business practices',
      color: '#10B981'
    },
    {
      icon: '🌱',
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and sustainable sourcing',
      color: '#84CC16'
    },
    {
      icon: '❤️',
      title: 'Community',
      description: 'Supporting local artisans and giving back to our community',
      color: '#EF4444'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'Embracing new technologies to enhance customer experience',
      color: '#3B82F6'
    }
  ];

  stats = [
    { number: '10K+', label: 'Happy Customers', icon: '😊' },
    { number: '15+', label: 'Years Experience', icon: '⭐' },
    { number: '50+', label: 'Awards Won', icon: '🏆' },
    { number: '100%', label: 'Satisfaction Guarantee', icon: '✓' }
  ];

  ngOnInit() {
    setTimeout(() => this.isVisible.set(true), 100);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY;
    this.scrollY.set(scrollY);
    
    // Update active section based on scroll position
    const sections = ['hero', 'story', 'values', 'team', 'milestones'];
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          this.activeSection.set(section);
          break;
        }
      }
    }
  }

  getParallaxTransform(): string {
    const yOffset = this.scrollY() * 0.3;
    return `translateY(${yOffset}px)`;
  }

  getStaggerDelay(index: number): string {
    return (index * 0.1) + 's';
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}