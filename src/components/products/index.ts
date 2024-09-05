export * from "./CreateProductForm";
export * from "./EditProductForm";
export * from "./ProductList";

export interface Product {
  industryId: string | undefined;
  brand: string;
  code: string;
  description: string;
  salePrice: number;
  costPrice: number;
  unit: string;
  packing: string;
  status: boolean;
  imageSrc: string;
}

export const DEFAULT_PRODUCT: Product = {
  industryId: "",
  brand: "",
  code: "",
  description: "",
  salePrice: 0,
  costPrice: 0,
  unit: "",
  packing: "",
  status: true,
  imageSrc: "",
};
