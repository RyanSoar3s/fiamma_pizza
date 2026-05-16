export type CartItem = {
  id: string;
  title: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  quantity: number;
  currencyId: string;
};

export type CartMeta = {
  externalReference: string | null;
};
