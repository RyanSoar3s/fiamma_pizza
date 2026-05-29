import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Products } from './products';
import { Api } from '@services/api';
import { Cart } from '@services/cart';
import { ApiMock } from '@mocks/api.mock';


describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;
  let cart: Cart;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [
        Cart,
        {
          provide: Api,
          useClass: ApiMock
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    cart = TestBed.inject(Cart);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add selected product to cart', () => {
    component.addToCart({
      id: 1,
      name: 'Margherita D.O.P',
      desc: 'Molho',
      price: 58,
      imageUrl: 'http://image'
    });

    expect(cart.items().length).toBe(1);
    expect(cart.items()[0].productId).toBe(1);
    expect(cart.items()[0].title).toBe('Margherita D.O.P');
    expect(cart.totalItems()).toBe(1);
  });
});
