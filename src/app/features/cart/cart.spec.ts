import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Cart as CartComponent } from './cart';
import { Api } from '@services/api';
import { Cart as CartStore } from '@services/cart';
import { ApiMock } from '@mocks/api.mock';
import { CreatePaymentPreferencePayload, PaymentsSummaryRequest } from '@models/payments.model';


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
      productId: 1,
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
    expect(cartStore.getExternalReference()).toBe('pedido-1');
    expect(cartStore.getPreferenceExpiresAt()).toBe('2026-05-31T10:10:00.000Z');
    expect(openSpy).toHaveBeenCalledWith('https://example.com/checkout', '_blank', 'noopener,noreferrer');
  });

  it('should use totals returned by payment summary', () => {
    component.createPaymentPreference();

    const payload = api.createPaymentPreference.mock.calls[0][0] as CreatePaymentPreferencePayload;
    const summaryPayload = api.getPaymentSummary.mock.calls.at(-1)?.[0] as PaymentsSummaryRequest;

    expect(payload.items).toEqual([{ productId: 1, quantity: 1 }]);
    expect(payload.externalReference).toBeUndefined();
    expect(summaryPayload.items).toEqual([{ productId: 1, quantity: 1 }]);
    expect(component['subtotal']()).toBe(50);
    expect(component['serviceFee']()).toBe(7);
    expect(component['total']()).toBe(57);
  });

  it('should reuse stored payment preference while it is valid', () => {
    cartStore.setPaymentPreference('pedido-existente', '2099-05-31T10:10:00.000Z');

    component.createPaymentPreference();

    const payload = api.createPaymentPreference.mock.calls[0][0] as CreatePaymentPreferencePayload;
    expect(payload.externalReference).toBe('pedido-existente');
  });

  it('should not reuse stored payment preference without expiration', () => {
    cartStore.setExternalReference('pedido-antigo');

    component.createPaymentPreference();

    const payload = api.createPaymentPreference.mock.calls[0][0] as CreatePaymentPreferencePayload;
    expect(payload.externalReference).toBeUndefined();
  });

  it('should move order to completed area when payment status is approved', () => {
    cartStore.setExternalReference('pedido-1');

    component.checkPaymentStatus();

    expect(api.getPaymentStatus).toHaveBeenCalledWith('pedido-1');
    expect(component['checkoutMessage']()).toContain('movido');
    expect(cartStore.items().length).toBe(0);
  });

  it('should use stored order status when payment is not found in Mercado Pago', () => {
    api.getPaymentStatus.mockReturnValue(of({
      found: true,
      externalReference: 'pedido-1',
      payment: null,
      storedOrder: {
        status: 'pending',
        paymentId: null,
        createdAt: '2026-05-29T10:00:00.000Z',
        updatedAt: '2026-05-29T10:00:00.000Z'
      }
    }));
    cartStore.setExternalReference('pedido-1');

    component.checkPaymentStatus();

    expect(component['paymentStatus']()?.storedOrder?.status).toBe('pending');
    expect(component['checkoutMessage']()).toBe('Pagamento pendente. Aguarde a confirmacao.');
  });

  it('should expose API error message on payment failure', () => {
    api.createPaymentPreference.mockReturnValue(
      throwError(() => ({ error: { error: 'Failed to create Mercado Pago preference.' } }))
    );

    component.createPaymentPreference();

    expect(component['checkoutError']()).toBe('Failed to create Mercado Pago preference.');
  });
});
