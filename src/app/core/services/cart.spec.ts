import { TestBed } from '@angular/core/testing';

import { Cart } from './cart';

const CART_STORAGE_KEY = 'fiamma_cart_items';
const CART_META_STORAGE_KEY = 'fiamma_cart_meta';

describe('Cart Service', () => {
  let service: Cart;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(Cart);
  });

  it('should add items and aggregate quantity', () => {
    service.addItem({
      id: 'pizza-margherita',
      productId: 1,
      title: 'Margherita',
      description: 'Desc',
      unitPrice: 58,
      imageUrl: 'http://image',
      currencyId: 'BRL'
    });

    service.addItem({
      id: 'pizza-margherita',
      productId: 1,
      title: 'Margherita',
      description: 'Desc',
      unitPrice: 58,
      imageUrl: 'http://image',
      currencyId: 'BRL'
    });

    expect(service.items().length).toBe(1);
    expect(service.items()[0].quantity).toBe(2);
    expect(service.totalItems()).toBe(2);
    expect(service.subtotal()).toBe(116);
  });

  it('should update quantity and remove item when quantity is zero', () => {
    service.addItem({
      id: 'drink-ipa',
      productId: 2,
      title: 'IPA',
      description: 'Desc',
      unitPrice: 22,
      imageUrl: 'http://image',
      currencyId: 'BRL'
    }, 2);

    service.updateQuantity('drink-ipa', 1);
    expect(service.items()[0].quantity).toBe(1);

    service.updateQuantity('drink-ipa', 0);
    expect(service.items().length).toBe(0);
  });

  it('should persist cart items and external reference in localStorage', () => {
    service.addItem({
      id: 'dessert',
      productId: 3,
      title: 'Tiramisu',
      description: 'Desc',
      unitPrice: 30,
      imageUrl: 'http://image',
      currencyId: 'BRL'
    });
    service.setExternalReference('pedido-123');

    expect(localStorage.getItem(CART_STORAGE_KEY)).toContain('Tiramisu');
    expect(localStorage.getItem(CART_META_STORAGE_KEY)).toContain('pedido-123');
  });
});
