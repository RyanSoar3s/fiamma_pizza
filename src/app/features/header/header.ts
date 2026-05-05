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

  protected readonly responsive = inject(Responsive);
  protected isOpenMenu = signal(false);

  toggleMenu(): void {
    this.isOpenMenu.update((value) => !value);
  }

  @HostListener("window:resize")
  onWindowResize(): void {
    if (this.isOpenMenu()) {
      this.isOpenMenu.set(false);

    }

  }

}
