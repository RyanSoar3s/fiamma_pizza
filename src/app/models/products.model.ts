export type ProductItem = {
  name: string;
  desc: string;
  price: number;
  imageUrl: string;
};


export type ProductCategory = {
  title: string;
  items: ProductItem[];

};

export type HealthResponse = {
  status: string;

};
