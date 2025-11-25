import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
 
import { Footer } from "./layout/footer/footer";
 
import { Spinner } from "./core/Component/spinner/spinner";
import { Navbar } from './layout/navbar/navbar';
import { ToastContainer } from './core/Component/toast-container/toast-container';
 
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, ToastContainer , Spinner],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'DarElite-UI';
 
}
