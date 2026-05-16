import { vi } from 'vitest';
import { of } from 'rxjs';

export class ApiMock {
  getMenu = vi.fn().mockReturnValue(of([]));

  createPaymentPreference = vi.fn().mockReturnValue(of({
    initPoint: 'https://example.com/checkout'

  }));

  getPaymentStatus = vi.fn().mockReturnValue(of({
    found: true,
    externalReference: 'pedido-1',
    payment: { status: 'approved' }

  }));

}
