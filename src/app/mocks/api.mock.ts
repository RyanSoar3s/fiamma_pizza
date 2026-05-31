import { vi } from 'vitest';
import { of } from 'rxjs';

export class ApiMock {
  getMenu = vi.fn().mockReturnValue(of([]));

  createPaymentPreference = vi.fn().mockReturnValue(of({
    id: 'preference-1',
    initPoint: 'https://example.com/checkout',
    sandboxInitPoint: null,
    externalReference: 'pedido-1',
    expiresAt: '2026-05-31T10:10:00.000Z',
    expiresInSeconds: 600,
    reused: false

  }));

  getPaymentSummary = vi.fn().mockReturnValue(of({
    items: [
      {
        id: 'pizza',
        title: 'Pizza',
        quantity: 1,
        unit_price: 50,
        currency_id: 'BRL'
      }
    ],
    fee: {
      id: 'order-fee',
      title: 'Taxa de serviço',
      quantity: 1,
      unit_price: 7,
      currency_id: 'BRL'
    },
    subtotal: 50,
    total: 57,
    currencyId: 'BRL'
  }));

  getPaymentStatus = vi.fn().mockReturnValue(of({
    found: true,
    externalReference: 'pedido-1',
    payment: { status: 'approved' }

  }));

  getOrders = vi.fn().mockReturnValue(of({
    count: 0,
    orders: []
  }));

}
