import { Injectable, computed, signal } from '@angular/core';
import { CartItem, CartMeta } from '@models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class Cart {
  private CART_STORAGE_KEY = 'fiamma_cart_items';
  private CART_META_STORAGE_KEY = 'fiamma_cart_meta';
  private readonly itemsSignal = signal<CartItem[]>(this.loadItems());
  private readonly metaSignal = signal<CartMeta>(this.loadMeta());

  readonly items = this.itemsSignal.asReadonly();
  readonly subtotal = computed(() => this.itemsSignal().reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0));
  readonly totalItems = computed(() => this.itemsSignal().reduce((acc, item) => acc + item.quantity, 0));

  addItem(item: Omit<CartItem, 'quantity'>, quantity = 1): void {
    if (quantity <= 0) return;

    const next = [ ...this.itemsSignal() ];
    const existingIndex = next.findIndex((cartItem) => cartItem.id === item.id);

    if (existingIndex >= 0) {
      const current = next[existingIndex];
      next[existingIndex] = { ...current, quantity: current.quantity + quantity };

    } else {
      next.push({ ...item, quantity });

    }

    this.itemsSignal.set(next);
    this.persistItems(next);
    this.clearPaymentPreference();

  }

  removeItem(itemId: string): void {
    const next = this.itemsSignal().filter((item) => item.id !== itemId);
    this.itemsSignal.set(next);
    this.persistItems(next);
    this.clearPaymentPreference();

  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;

    }

    const next = this.itemsSignal().map((item) => (item.id === itemId) ? { ...item, quantity } : item);
    this.itemsSignal.set(next);
    this.persistItems(next);
    this.clearPaymentPreference();

  }

  clear(): void {
    this.itemsSignal.set([]);
    this.persistItems([]);

  }

  getExternalReference(): string | null {
    return this.metaSignal().externalReference;

  }

  setExternalReference(externalReference: string | null): void {
    const next = {
      ...this.metaSignal(),
      externalReference,
      preferenceExpiresAt: externalReference ? this.metaSignal().preferenceExpiresAt : null,
      preferenceExpiresInSeconds: externalReference ? this.metaSignal().preferenceExpiresInSeconds : null
    };
    this.metaSignal.set(next);
    this.persistMeta(next);

  }

  getPreferenceExpiresAt(): string | null {
    return this.metaSignal().preferenceExpiresAt;

  }

  getPreferenceExpiresInSeconds(): number | null {
    return this.metaSignal().preferenceExpiresInSeconds;

  }

  setPaymentPreference(
    externalReference: string | null,
    preferenceExpiresAt: string | null,
    preferenceExpiresInSeconds: number | null
  ): void {
    const next = {
      ...this.metaSignal(),
      externalReference,
      preferenceExpiresAt,
      preferenceExpiresInSeconds
    };
    this.metaSignal.set(next);
    this.persistMeta(next);

  }

  clearPaymentPreference(): void {
    this.setPaymentPreference(null, null, null);

  }

  private loadItems(): CartItem[] {
    const raw = localStorage.getItem(this.CART_STORAGE_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as CartItem[];
      if (!Array.isArray(parsed)) return [];

      return parsed.filter((item) =>
        typeof item.id === 'string' &&
        typeof item.productId === 'number' &&
        typeof item.title === 'string' &&
        typeof item.description === 'string' &&
        typeof item.imageUrl === 'string' &&
        typeof item.currencyId === 'string' &&
        typeof item.unitPrice === 'number' &&
        item.unitPrice > 0 &&
        typeof item.quantity === 'number' &&
        item.quantity > 0

      );

    } catch {
      return [];

    }

  }

  private loadMeta(): CartMeta {
    const raw = localStorage.getItem(this.CART_META_STORAGE_KEY);
    if (!raw) {
      return { externalReference: null, preferenceExpiresAt: null, preferenceExpiresInSeconds: null };
    }

    try {
      const parsed = JSON.parse(raw) as CartMeta;
      return {
        externalReference: typeof parsed.externalReference === 'string' ? parsed.externalReference : null,
        preferenceExpiresAt: typeof parsed.preferenceExpiresAt === 'string' ? parsed.preferenceExpiresAt : null,
        preferenceExpiresInSeconds: typeof parsed.preferenceExpiresInSeconds === 'number'
          ? parsed.preferenceExpiresInSeconds
          : null
      };

    } catch {

      return { externalReference: null, preferenceExpiresAt: null, preferenceExpiresInSeconds: null };

    }
  }

  private persistItems(items: CartItem[]): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));

  }

  private persistMeta(meta: CartMeta): void {
    localStorage.setItem(this.CART_META_STORAGE_KEY, JSON.stringify(meta));

  }

}
