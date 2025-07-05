import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // تأكد من أن المسار صحيح
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { loaderInterceptor } from './core/interceptor/loader.interceptor';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { HomeModule } from './home/home/home.module';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
  
  
  ],
  imports: [
   
    BrowserModule,
    AppRoutingModule, // يتم تضمين RouterModule هنا عبر AppRoutingModule
    CoreModule,
    HomeModule,
    RouterLink,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      closeButton: true,
      positionClass: 'toast-top-right',
      countDuplicates: true,
      timeOut: 1500,
      progressBar: true,
    }),
   
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: loaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // إضافة الأيقونات هنا
  }
 }