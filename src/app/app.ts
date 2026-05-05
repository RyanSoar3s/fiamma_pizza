import { Component } from '@angular/core';
import { Header } from './features/header/header';
import { About } from './features/about/about';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    About

  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
