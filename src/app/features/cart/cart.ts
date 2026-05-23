import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CreatePaymentPreferencePayload, GetOrdersResponse, PaymentStatusResponse, SavedOrder } from '@models/payments.model';
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

  protected readonly deliveryFee = signal(7);
  protected readonly isSubmitting = signal(false);
  protected readonly isCheckingStatus = signal(false);
  protected readonly checkoutMessage = signal<string | null>(null);
  protected readonly checkoutError = signal<string | null>(null);
  protected readonly paymentStatus = signal<PaymentStatusResponse | null>(null);
  protected readonly orders = signal<SavedOrder[]>([]);
  protected readonly isLoadingOrders = signal(false);

  protected readonly subtotal = this.cartStore.subtotal;
  protected readonly total = computed(() => this.subtotal() + this.deliveryFee());
  protected readonly hasItems = computed(() => this.cartStore.items().length > 0);
  protected readonly externalReference = computed(() => this.cartStore.getExternalReference());
  protected readonly finalizedOrders = computed(() => this.orders().filter((order) => this.isOrderFinalized(order.status)));

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

    const externalReference = `pedido-${Date.now()}`;
    this.cartStore.setExternalReference(externalReference);

    const payload: CreatePaymentPreferencePayload = {
      items: this.cartStore.items().map((item) => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: item.currencyId

      })),
      externalReference

    };

    this.isSubmitting.set(true);
    this.checkoutError.set(null);
    this.checkoutMessage.set(null);
    this.paymentStatus.set(null);

    this.api.createPaymentPreference(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          const redirectUrl = response.initPoint ?? response.sandboxInitPoint;
          this.loadOrders();

          if (!redirectUrl) {
            this.checkoutError.set('Preferencia criada sem URL de pagamento. Tente novamente.');
            return;

          }

          this.checkoutMessage.set('Abrindo pagamento em uma nova aba...');
          window.open(redirectUrl, '_blank', 'noopener,noreferrer');

        },
        error: (error: HttpErrorResponse) => {
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
            this.checkoutMessage.set(this.resolvePaymentStatusMessage(statusResponse.payment?.status));
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
    const orderStatus = statusResponse.order?.status;
    const paymentStatus = statusResponse.payment?.status;
    const isFinalized = this.isOrderFinalized(orderStatus) || paymentStatus === 'approved';

    if (!isFinalized) return false;

    this.checkoutMessage.set('Pedido finalizado e movido para a area de pedidos feitos.');
    this.cartStore.clear();
    this.cartStore.setExternalReference(null);
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

}
