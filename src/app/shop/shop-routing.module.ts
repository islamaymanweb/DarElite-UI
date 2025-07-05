import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ShopComponent },
  { path: 'product-details/:id', component: ProductDetailsComponent },
];





@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule { }
