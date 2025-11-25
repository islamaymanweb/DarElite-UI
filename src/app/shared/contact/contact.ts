import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface ContactInfo {
  icon: string;
  title: string;
  description: string;
  details: string[];
  color: string;
}

interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact  implements OnInit {
  @ViewChild('contactForm') contactForm!: ElementRef;
  
  contactFormGroup: FormGroup;
  isSubmitting = signal(false);
  isVisible = signal(false);
  activeTab = signal('form');
  mapLoaded = signal(false);

  contactInfo: ContactInfo[] = [
    {
      icon: '📍',
      title: 'Visit Our Showroom',
      description: 'Experience our furniture in person',
      details: [
        '123 Design District',
        'Cairo, Egypt',
        'Open Daily: 9AM - 9PM'
      ],
      color: '#8B5CF6'
    },
    {
      icon: '📞',
      title: 'Call Us Directly',
      description: 'Speak with our design consultants',
      details: [
        '+20 100 123 4567',
        '+20 100 765 4321',
        'Mon-Sun: 8AM - 10PM'
      ],
      color: '#10B981'
    },
    {
      icon: '✉️',
      title: 'Email Us',
      description: 'Send us your inquiries and requests',
      details: [
        'hello@darelite.com',
        'support@darelite.com',
        'Response within 2 hours'
      ],
      color: '#3B82F6'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Instant support from our team',
      details: [
        'Available 24/7',
        'Design consultation',
        'Quick responses'
      ],
      color: '#F59E0B'
    }
  ];

  faqs: FAQ[] = [
    {
      question: 'Do you offer custom furniture design?',
      answer: 'Yes! We specialize in custom furniture design. Our design team will work with you to create unique pieces that perfectly match your space and style preferences.',
      isOpen: false
    },
    {
      question: 'What is your delivery timeline?',
      answer: 'Standard delivery takes 2-4 weeks. Custom pieces may take 6-8 weeks. We offer express delivery options for urgent requests.',
      isOpen: false
    },
    {
      question: 'Do you provide installation services?',
      answer: 'Absolutely! We offer professional white-glove delivery and installation services for all our furniture pieces at no extra cost.',
      isOpen: false
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all standard items. Custom pieces are non-returnable but covered by our quality guarantee.',
      isOpen: false
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship worldwide. International shipping costs and timelines vary by location. Contact us for specific quotes.',
      isOpen: false
    }
  ];

 

  constructor(private fb: FormBuilder) {
    this.contactFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      serviceType: ['general', Validators.required],
      budget: ['medium', Validators.required],
      preferredContact: ['email', Validators.required]
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.isVisible.set(true);
      this.loadMap();
    }, 100);
  }

  loadMap() {
    // Simulate map loading
    setTimeout(() => this.mapLoaded.set(true), 2000);
  }

  onSubmit() {
    if (this.contactFormGroup.valid) {
      this.isSubmitting.set(true);
      
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.showSuccessMessage();
        this.contactFormGroup.reset({
          serviceType: 'general',
          budget: 'medium',
          preferredContact: 'email'
        });
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.contactFormGroup.controls).forEach(key => {
      this.contactFormGroup.get(key)?.markAsTouched();
    });
  }

  showSuccessMessage() {
    // Create success notification
    const successEl = document.createElement('div');
    successEl.className = 'form-success';
    successEl.innerHTML = `
      <div class="success-content">
        <span class="success-icon">✅</span>
        <h3>Message Sent Successfully!</h3>
        <p>We'll get back to you within 2 hours</p>
      </div>
    `;
    
    document.body.appendChild(successEl);
    
    setTimeout(() => {
      successEl.remove();
    }, 4000);
  }

  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  getFieldError(fieldName: string): string {
    const field = this.contactFormGroup.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return 'Too short';
      if (field.errors['pattern']) return 'Invalid format';
    }
    return '';
  }

  // Animation helpers
  getStaggerDelay(index: number): string {
    return (index * 0.1) + 's';
  }

  getParallaxTransform(): string {
    return `translateY(${window.scrollY * 0.3}px)`;
  }
}