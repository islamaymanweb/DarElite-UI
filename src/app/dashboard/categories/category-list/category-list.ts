// src/app/components/category-list/category-list.component.ts
import { Component, OnInit } from '@angular/core';
 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICateogry } from '../../../core/models/Category ';
import { CategoryService } from '../../../core/services/category-service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.scss']
})
export class CategoryList  implements OnInit {
  categories: ICateogry[] = [];
  showAddForm = false;
  showEditForm = false;
  selectedCategory: ICateogry | null = null;
  
  newCategory = {
    name: '',
    description: ''
  };

  editCategory = {
    id: 0,
    name: '',
    description: ''
  };

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        alert('Error loading categories');
      }
    });
  }

  onAddSubmit(): void {
    this.categoryService.addCategory(this.newCategory).subscribe({
      next: (response) => {
        alert('Category added successfully!');
        this.loadCategories();
        this.showAddForm = false;
        this.resetNewCategoryForm();
      },
      error: (error) => {
        console.error('Error adding category:', error);
        alert('Error adding category');
      }
    });
  }

  onEditSubmit(): void {
    this.categoryService.updateCategory(this.editCategory).subscribe({
      next: (response) => {
        alert('Category updated successfully!');
        this.loadCategories();
        this.showEditForm = false;
        this.selectedCategory = null;
      },
      error: (error) => {
        console.error('Error updating category:', error);
        alert('Error updating category');
      }
    });
  }

  editCategoryItem(category: ICateogry): void {
    this.editCategory = {
      id: category.id,
      name: category.name,
      
      description: category.description
    };
    this.showEditForm = true;
    this.showAddForm = false;
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: (response) => {
          alert('Category deleted successfully!');
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Error deleting category');
        }
      });
    }
  }

  showAddCategoryForm(): void {
    this.showAddForm = true;
    this.showEditForm = false;
    this.selectedCategory = null;
  }

  cancelForms(): void {
    this.showAddForm = false;
    this.showEditForm = false;
    this.selectedCategory = null;
    this.resetNewCategoryForm();
  }

  private resetNewCategoryForm(): void {
    this.newCategory = {
      name: '',
      description: ''
    };
  }
  // أضف هذه الدالة داخل الكلاس CategoryList
trackByCategoryId(index: number, category: ICateogry): number {
  return category.id;
}
}