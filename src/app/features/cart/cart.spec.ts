import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';

import { Cart as CartComponent } from './cart';
import { Api } from '@services/api';
import { Cart as CartStore } from '@services/cart';
import { ApiMock } from '@mocks/api.mock';


describe('Cart Component', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartStore: CartStore;
  let api: ApiMock;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideRouter([]),
        CartStore,
        {
          provide: Api,
          useClass: ApiMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartStore = TestBed.inject(CartStore);
    api = TestBed.inject(Api) as unknown as ApiMock;

    cartStore.addItem({
      id: 'pizza',
      title: 'Pizza',
      description: 'Desc',
      unitPrice: 50,
      imageUrl: 'http://image',
      currencyId: 'BRL'
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create payment preference and open checkout in new tab', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.createPaymentPreference();

    expect(api.createPaymentPreference).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith('https://example.com/checkout', '_blank', 'noopener,noreferrer');
  });

  it('should set message when payment status is approved', () => {
    cartStore.setExternalReference('pedido-1');

    component.checkPaymentStatus();

    expect(api.getPaymentStatus).toHaveBeenCalledWith('pedido-1');
    expect(component['checkoutMessage']()).toContain('aprovado');
  });

  it('should expose API error message on payment failure', () => {
    api.createPaymentPreference.mockReturnValue(
      throwError(() => ({ error: { error: 'Failed to create Mercado Pago preference.' } }))
    );

    component.createPaymentPreference();

    expect(component['checkoutError']()).toBe('Failed to create Mercado Pago preference.');
  });
});
