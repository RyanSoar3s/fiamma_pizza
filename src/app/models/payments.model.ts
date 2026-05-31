export type PaymentPreferenceItem = {
  id?: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
};

export type CreatePaymentPreferenceItem = {
  productId: number;
  quantity: number;
};

export type CreatePaymentPreferencePayload = {
  items: CreatePaymentPreferenceItem[];
  payerEmail?: string;
  externalReference?: string;
};

export type PaymentsSummaryRequest = {
  items: CreatePaymentPreferenceItem[];
};

export type PaymentsSummaryResponse = {
  items: Required<PaymentPreferenceItem>[];
  fee: Required<PaymentPreferenceItem>;
  subtotal: number;
  total: number;
  currencyId: string;
};

export type CreatePaymentPreferenceResponse = {
  id: string | undefined;
  initPoint: string | undefined;
  sandboxInitPoint: string | undefined | null;
  externalReference: string;
  expiresAt: Date | string;
  expiresInSeconds: number;
  reused: boolean;
};

export type PaymentStatusResponse = {
  found: boolean;
  externalReference: string;
  payment?: {
    id?: string;
    status?: string;
    statusDetail?: string;
    transactionAmount?: number;
    dateCreated?: string;
    dateApproved?: string;
  } | null;
  storedOrder?: {
    status?: string;
    paymentId?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
};

export type SavedOrder = {
  externalReference: string;
  payerEmail: string | null;
  items: unknown;
  status: string;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetOrdersResponse = {
  count: number;
  orders: SavedOrder[];
};
