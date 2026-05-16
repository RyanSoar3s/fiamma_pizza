export type PaymentPreferenceItem = {
  id?: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
};

export type CreatePaymentPreferencePayload = {
  items: PaymentPreferenceItem[];
  payerEmail?: string;
  externalReference?: string;
};

export type CreatePaymentPreferenceResponse = {
  id?: string;
  initPoint?: string;
  sandboxInitPoint?: string;
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
  };
};
