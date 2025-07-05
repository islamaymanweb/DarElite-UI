import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { authGuard } from './guard/auth.guard';
import { AboutUsComponent } from './core/about-us/about-us.component';
import { ContactComponent } from './core/contact/contact.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then((m) => m.ShopModule),
  },

  {
    path: 'basket',
    loadChildren: () => import('./basket/basket.module').then((m) => m.BasketModule), 
    
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then((m) => m.CheckoutModule), 
    canActivate:[authGuard]
  },
  {
    path: 'Account',
    loadChildren: () => import('./identity/identity.module').then((m) => m.IdentityModule), 
    
  },
  {path:'about',component:AboutUsComponent },
  { 
    path: 'contact', 
    component:ContactComponent
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then((m) => m.OrdersModule), 
    canActivate:[authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }