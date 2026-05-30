import { Component } from '@angular/core';
import { About } from '../about/about';
import { Products } from '../products/products';

@Component({
  selector: 'app-home',
  imports: [
    About,
    Products

  ],
  templateUrl: './home.html',
})
export class Home {

}
