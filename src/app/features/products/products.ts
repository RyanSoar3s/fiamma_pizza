import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductCategory, ProductItem } from '@models/products.model';
import { Api } from '@services/api';
import { Cart } from '@services/cart';

@Component({
  selector: 'app-products',
  host: { id: 'cardapio' },
  imports: [
    CommonModule,
    CurrencyPipe

  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  private readonly api = inject(Api);
  private readonly cart = inject(Cart);

  protected products: WritableSignal<ProductCategory[]> = signal([]);

  ngOnInit(): void {
    this.api.getMenu().subscribe((menu) => {
      this.products.set(menu);

    });

  }
  
  protected getSectionId(category: ProductCategory, index: number): string | null {
    const normalizedTitle = category.title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    if (normalizedTitle.includes('pizza')) return 'pizzas';
    if (normalizedTitle.includes('bebida')) return 'bebidas';
    if (normalizedTitle.includes('sobremesa')) return 'sobremesas';

    return (index === 0) ? 'pizzas' :
            (index === 1) ? 'bebidas' :
              (index === 2) ? 'sobremesas' : null;

  }

  addToCart(item: ProductItem): void {
    const normalizedId = item.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    this.cart.addItem({
      id: normalizedId || crypto.randomUUID(),
      title: item.name,
      description: item.desc,
      unitPrice: item.price,
      imageUrl: item.imageUrl,
      currencyId: 'BRL'
    });
  }

}
