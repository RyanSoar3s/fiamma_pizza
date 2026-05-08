import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductCategory } from '@models/products.model';
import { Api } from '@services/api';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    CurrencyPipe

  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  private readonly api = inject(Api);

  protected products: WritableSignal<ProductCategory[]> = signal([]);

  ngOnInit(): void {
    this.api.getMenu().subscribe((menu) => {
      this.products.set(menu);

    });

  }

}
