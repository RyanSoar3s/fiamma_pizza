export type CartItem = {
  id: string;
  productId: number;
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
