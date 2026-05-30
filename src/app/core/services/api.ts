import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HealthResponse, ProductCategory } from '@models/products.model';
import {
  CreatePaymentPreferencePayload,
  CreatePaymentPreferenceResponse,
  GetOrdersResponse,
  PaymentsSummaryRequest,
  PaymentsSummaryResponse,
  PaymentStatusResponse,
} from '@models/payments.model';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/api/health`);

  }

  getMenu(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${this.baseUrl}/api/menu`);

  }

  createPaymentPreference(payload: CreatePaymentPreferencePayload): Observable<CreatePaymentPreferenceResponse> {
    return this.http.post<CreatePaymentPreferenceResponse>(`${this.baseUrl}/api/payments/preference`, payload);

  }

  getPaymentSummary(payload: PaymentsSummaryRequest): Observable<PaymentsSummaryResponse> {
    return this.http.post<PaymentsSummaryResponse>(`${this.baseUrl}/api/payments/summary`, payload);

  }

  getPaymentStatus(externalReference: string): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(`${this.baseUrl}/api/payments/status/${encodeURIComponent(externalReference)}`);

  }

  getOrders(): Observable<GetOrdersResponse> {
    return this.http.get<GetOrdersResponse>(`${this.baseUrl}/api/orders`);

  }
}
