import { Component } from '@angular/core';
import { Header } from './features/header/header';
import { About } from './features/about/about';
import { Products } from './features/products/products';
import { Footer } from './features/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    About,
    Products,
    Footer

  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
