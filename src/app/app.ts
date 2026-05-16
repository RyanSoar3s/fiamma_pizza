import { Component } from '@angular/core';
import { Header } from './features/header/header';
import { Footer } from './features/footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    RouterOutlet,
    Footer

  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
