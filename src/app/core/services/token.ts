import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Token {
  
  isTokenValid(): boolean {
     
    return true; 
  }

  clearToken(): void {
    
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}