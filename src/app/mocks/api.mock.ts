import { vi } from 'vitest';
import { of } from 'rxjs';

export class ApiMock {
  getMenu = vi.fn().mockReturnValue(of([]));

  createPaymentPreference = vi.fn().mockReturnValue(of({
    initPoint: 'https://example.com/checkout'

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
