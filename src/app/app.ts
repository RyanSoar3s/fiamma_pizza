import { Component } from '@angular/core';
import { Header } from './features/header/header';
import { About } from './features/about/about';
import { Products } from './features/products/products';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    About,
    Products

  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
