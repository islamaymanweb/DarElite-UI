import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { authGuard } from './core/guard/auth-guard';
 
import { Dashboard } from './dashboard/dashboard/dashboard';
import { adminGuard } from './core/guard/admin-guard';
import { Forbidden } from './core/Component/forbidden/forbidden';
 
export const routes: Routes = 
[
     { path: '', component: Home  },
      {
    path: 'about',
    loadComponent: () => import('./shared/about/about').then(m => m.About )
  }
     ,
      {
    path: 'contact',
    loadComponent: () => import('./shared/contact/contact').then(m => m.Contact )
  }
     ,
       
   { 
    path: 'shop', 
    loadComponent: () => import('./features/shop/shop/shoppage').then(m => m.ShopPage)
  },
  { 
    path: 'shop/product-details/:id', 
    loadComponent: () => import('./features/shop/product-details/product-details').then(m => m.ProductDetails)
  },
 
      {
    path: 'basket',
    loadComponent: () => import('./features/basket/basket/basket').then(m => m.Basket )
  },
   
       
   { 
    path: 'register', 
    loadComponent: () => import('./features/identity/register/register').then(m => m.Register)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/identity/login/login').then(m => m.Login)
  },
  { 
    path: 'reset-password', 
    loadComponent: () => import('./features/identity/reset-password/reset-password').then(m => m.ResetPasswordComponent)
  },
   { 
    path: 'Account/Reset-Password', 
    loadComponent: () => import('./features/identity/reset-password/reset-password').then(m => m.ResetPasswordComponent)
  },
  { 
    path: 'account/reset-password', 
    loadComponent: () => import('./features/identity/reset-password/reset-password').then(m => m.ResetPasswordComponent)
  },
  { 
    path: 'Reset-Password', 
    loadComponent: () => import('./features/identity/reset-password/reset-password').then(m => m.ResetPasswordComponent)
  },
  { 
    path: 'reset-password', 
    loadComponent: () => import('./features/identity/reset-password/reset-password').then(m => m.ResetPasswordComponent)
  },
  { 
    path: 'active', 
    loadComponent: () => import('./features/identity/active/active').then(m => m.Active)
  },
  { 
    path: 'Account/active', 
    loadComponent: () => import('./features/identity/active/active').then(m => m.Active)
  } , 
   {
    path: 'orders',
    loadComponent: () => import('./features/orders/order/order').then(m => m.Order ),  canActivate:[authGuard]
  },
  {
    path: 'order-item',
    loadComponent: () => import('./features/orders/order-item/order-item').then(m => m.OrderItem ),  canActivate:[authGuard]
  },
    {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout/checkout').then(m => m.Checkout),
    canActivate: [authGuard]
  },
  {
    path: 'checkout/success',
    loadComponent: () => import('./features/checkout/success/success').then(m => m.Success ),
    canActivate: [authGuard]
  },
    { path: 'dashboard',
       canActivate: [authGuard, adminGuard],
       loadComponent: () => import('./dashboard/dashboard/dashboard').then(m => m.Dashboard ) },
    { path: 'categories', 
       canActivate: [authGuard, adminGuard],
       loadComponent: () => import('./dashboard/categories/category-list/category-list').then(m => m.CategoryList )
     },
     { path: 'products', 
        canActivate: [authGuard, adminGuard],
       loadComponent: () => import('./dashboard/products/products-list/products-list').then(m => m.ProductList )
     },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin-list/admin-list').then(m => m.AdminList)
  },
  {
    path: 'admin/add',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/add-admin/add-admin').then(m => m.AddAdmin)
  },
/*  { path: 'admin-orders', 
       loadComponent: () => import('./dashboard/orders/admin-order-list/admin-order-list').then(m => m.AdminOrderList )
     }, */
      { path: 'forbidden', loadComponent: () => import('./core/Component/forbidden/forbidden').then(m => m.Forbidden ) },

  { path: '**', redirectTo: '/shop', pathMatch: 'full' }
 
    
]
