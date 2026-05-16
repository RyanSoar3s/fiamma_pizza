import { Component, HostListener, inject, signal } from '@angular/core';
import { Responsive } from '@services/responsive';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected amount = signal(0);
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
