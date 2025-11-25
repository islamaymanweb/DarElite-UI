import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
  
  
import { credentialsInterceptor } from './core/Interceptors/credentials-interceptor';
import { loadingInterceptor } from './core/Interceptors/loading-interceptor';
 
 
 

export const appConfig: ApplicationConfig = {
  providers: [
/*     provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
     provideHttpClient(
      withInterceptors([errorInterceptor, credentialsInterceptor
 ]) 
), */
   provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
        withInMemoryScrolling({
        scrollPositionRestoration: 'top',  
        anchorScrolling: 'enabled'        
      }),
    ),
    provideHttpClient(
      withInterceptors([ credentialsInterceptor,loadingInterceptor])
    ),
  
    
]
};
