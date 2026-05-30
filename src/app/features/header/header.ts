import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cart } from '@services/cart';
import { Responsive } from '@services/responsive';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly cart = inject(Cart);
  protected readonly amount = this.cart.totalItems;
  protected options = [
    { label: 'Início', target: 'inicio' },
    { label: 'Pizzas', target: 'pizzas' },
    { label: 'Bebidas', target: 'bebidas' },
    { label: 'Sobremesas', target: 'sobremesas' }
    
  ];

  protected readonly responsive = inject(Responsive);
  protected isOpenMenu = signal(false);

  toggleMenu(): void {
    this.isOpenMenu.update((value) => !value);

  }

  scrollToSection(sectionId: string): void {
    const target = document.getElementById(sectionId);
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

  }

  @HostListener("window:resize")
  onWindowResize(): void {
    if (this.isOpenMenu()) {
      this.isOpenMenu.set(false);

    }

  }

}
