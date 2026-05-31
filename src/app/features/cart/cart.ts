import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CreatePaymentPreferencePayload, GetOrdersResponse, PaymentsSummaryRequest, PaymentsSummaryResponse, PaymentStatusResponse, SavedOrder } from '@models/payments.model';
import { Api } from '@services/api';
import { Cart as CartStore } from '@services/cart';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  private readonly api = inject(Api);
  protected readonly cartStore = inject(CartStore);

  private summaryRequestId = 0;

  protected readonly paymentSummary = signal<PaymentsSummaryResponse | null>(null);
  protected readonly isLoadingSummary = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly isCheckingStatus = signal(false);
  protected readonly checkoutMessage = signal<string | null>(null);
  protected readonly checkoutError = signal<string | null>(null);
  protected readonly paymentStatus = signal<PaymentStatusResponse | null>(null);
  protected readonly orders = signal<SavedOrder[]>([]);
  protected readonly isLoadingOrders = signal(false);

  protected readonly subtotal = computed(() => this.paymentSummary()?.subtotal ?? 0);
  protected readonly serviceFee = computed(() => {
    const fee = this.paymentSummary()?.fee;
    return (fee) ? fee.unit_price * fee.quantity : null;
  });
  protected readonly total = computed(() => this.paymentSummary()?.total ?? 0);
  protected readonly hasItems = computed(() => this.cartStore.items().length > 0);
  protected readonly externalReference = computed(() => this.cartStore.getExternalReference());
  protected readonly preferenceExpiresAt = computed(() => this.cartStore.getPreferenceExpiresAt());
  protected readonly preferenceExpiresInSeconds = computed(() => this.cartStore.getPreferenceExpiresInSeconds());
  protected readonly finalizedOrders = computed(() => this.orders().filter((order) => this.isOrderFinalized(order.status)));
  private readonly refreshSummary = effect(() => {
    this.loadPaymentSummary(this.buildOrderItems());
  });

  ngOnInit(): void {
    this.loadOrders();
  }

  increaseQuantity(itemId: string, currentQuantity: number): void {
    this.cartStore.updateQuantity(itemId, currentQuantity + 1);

  }

  decreaseQuantity(itemId: string, currentQuantity: number): void {
    this.cartStore.updateQuantity(itemId, currentQuantity - 1);

  }

  removeItem(itemId: string): void {
    this.cartStore.removeItem(itemId);

  }

  createPaymentPreference(): void {
    if (!this.hasItems()) {
      this.checkoutError.set('Seu carrinho está vazio. Adicione itens para continuar.');
      this.checkoutMessage.set(null);
      return;

    }

    if (!this.paymentSummary()) {
      this.checkoutError.set('Aguarde o cálculo do resumo do pedido.');
      this.checkoutMessage.set(null);
      return;

    }

    const reusableExternalReference = this.getReusableExternalReference();

    const payload: CreatePaymentPreferencePayload = {
      items: this.buildOrderItems()
    };

    if (reusableExternalReference) {
      payload.externalReference = reusableExternalReference;
    }

    this.isSubmitting.set(true);
    this.checkoutError.set(null);
    this.checkoutMessage.set(null);
    this.paymentStatus.set(null);

    this.api.createPaymentPreference(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          const redirectUrl = response.initPoint ?? response.sandboxInitPoint;
          this.cartStore.setPaymentPreference(
            response.externalReference,
            this.normalizePreferenceExpiresAt(response.expiresAt),
            response.expiresInSeconds
          );
          this.loadOrders();

          if (!redirectUrl) {
            this.checkoutError.set('Preferencia criada sem URL de pagamento. Tente novamente.');
            return;

          }

          this.checkoutMessage.set(
            response.reused ? 'Reabrindo pagamento em uma nova aba...' : 'Abrindo pagamento em uma nova aba...'
          );
          window.open(redirectUrl, '_blank', 'noopener,noreferrer');

        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.handleAlreadyApprovedPreference();
            return;
          }

          this.checkoutError.set(this.resolveApiError(error, 'Não foi possível iniciar o pagamento.'));

        }

    });

  }

  checkPaymentStatus(): void {
    const externalReference = this.cartStore.getExternalReference();
    if (!externalReference) {
      this.checkoutError.set('Nenhum pedido encontrado para consultar status.');
      this.paymentStatus.set(null);
      return;
    }

    this.isCheckingStatus.set(true);
    this.checkoutError.set(null);

    this.api.getPaymentStatus(externalReference)
      .pipe(finalize(() => this.isCheckingStatus.set(false)))
      .subscribe({
        next: (statusResponse) => {
          this.paymentStatus.set(statusResponse);
          const movedToOrders = this.syncOrderAndCartStatus(statusResponse);
          if (movedToOrders) return;

          if (!statusResponse.found) {
            this.checkoutMessage.set('Pagamento ainda não localizado. Tente novamente em instantes.');
          } else {
            this.checkoutMessage.set(this.resolvePaymentStatusMessage(this.resolveCurrentStatus(statusResponse)));
          }
        },
        error: (error: HttpErrorResponse) => {
          this.checkoutError.set(this.resolveApiError(error, 'Não foi possível consultar o status do pagamento.'));
        }
      });
  }

  loadOrders(): void {
    this.isLoadingOrders.set(true);
    this.api.getOrders()
      .pipe(finalize(() => this.isLoadingOrders.set(false)))
      .subscribe({
        next: (response) => this.orders.set(this.normalizeOrdersResponse(response)),
        error: () => this.orders.set([])
      });
  }

  private resolveApiError(error: HttpErrorResponse, fallback: string): string {
    const apiMessage = (error.error as { error?: string } | null)?.error;
    if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
      return apiMessage;
    }

    return fallback;
  }

  private handleAlreadyApprovedPreference(): void {
    this.checkoutError.set(null);
    this.checkoutMessage.set('Pedido ja aprovado. Movemos ele para a area de pedidos feitos.');
    this.cartStore.clear();
    this.cartStore.clearPaymentPreference();
    this.loadOrders();
  }

  private resolvePaymentStatusMessage(status?: string): string {
    switch (status) {
      case 'pending':
        return 'Pagamento pendente. Aguarde a confirmacao.';
      case 'approved':
        return 'Pagamento aprovado com sucesso.';
      case 'rejected':
        return 'Pagamento rejeitado. Tente outra forma de pagamento.';
      case 'in_process':
        return 'Pagamento em processamento.';
      case 'cancelled':
        return 'Pagamento cancelado.';
      case 'refunded':
        return 'Pagamento estornado.';
      default:
        return `Status atual: ${status ?? 'desconhecido'}.`;
    }
  }

  private syncOrderAndCartStatus(statusResponse: PaymentStatusResponse): boolean {
    const orderStatus = statusResponse.storedOrder?.status;
    const paymentStatus = statusResponse.payment?.status;
    const isFinalized = this.isOrderFinalized(orderStatus) || paymentStatus === 'approved';

    if (!isFinalized) return false;

    this.checkoutMessage.set('Pedido finalizado e movido para a area de pedidos feitos.');
    this.cartStore.clear();
    this.cartStore.clearPaymentPreference();
    this.loadOrders();
    return true;
  }

  private isOrderFinalized(status?: string): boolean {
    if (typeof status !== 'string') return false;

    const normalizedStatus = status.trim().toLowerCase();
    return normalizedStatus === 'finalizado' || normalizedStatus === 'approved';
  }

  private normalizeOrdersResponse(response: GetOrdersResponse): SavedOrder[] {
    return Array.isArray(response?.orders) ? response.orders : [];
  }

  protected resolveCurrentStatus(statusResponse: PaymentStatusResponse): string | undefined {
    return statusResponse.payment?.status ?? statusResponse.storedOrder?.status;
  }

  private getReusableExternalReference(): string | null {
    const externalReference = this.cartStore.getExternalReference();
    if (!externalReference) return null;

    const expiresAt = this.cartStore.getPreferenceExpiresAt();
    if (!expiresAt) return null;

    const expiresAtTime = new Date(expiresAt).getTime();
    if (Number.isNaN(expiresAtTime)) return null;

    return expiresAtTime > Date.now() ? externalReference : null;
  }

  private normalizePreferenceExpiresAt(expiresAt: Date | string): string {
    return expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt;
  }

  private buildOrderItems(): PaymentsSummaryRequest['items'] {
    return this.cartStore.items().map((item) => ({
      productId: item.productId,
      quantity: item.quantity

    }));
  }

  private loadPaymentSummary(items: PaymentsSummaryRequest['items']): void {
    const requestId = ++this.summaryRequestId;

    if (!items.length) {
      this.paymentSummary.set(null);
      this.isLoadingSummary.set(false);
      return;
    }

    this.isLoadingSummary.set(true);
    this.api.getPaymentSummary({ items })
      .pipe(finalize(() => {
        if (requestId === this.summaryRequestId) {
          this.isLoadingSummary.set(false);
        }
      }))
      .subscribe({
        next: (summary) => {
          if (requestId === this.summaryRequestId) {
            this.paymentSummary.set(summary);
          }
        },
        error: () => {
          if (requestId === this.summaryRequestId) {
            this.paymentSummary.set(null);
            this.checkoutError.set('Não foi possível calcular o resumo do pedido.');
          }
        }
      });
  }

}
