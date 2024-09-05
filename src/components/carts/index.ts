import { Product } from "@prisma/client";

export * from "./Cartlist";

export interface ProductProps {
  code: string;
  description: string;
  salePrice: number;
  unit: string;
}

export interface FinalItem {
  productId: string;
  qty: number;
  shelvesId: string;
  wholeSale: number;
  totalPrice: number;
  discount: number;
}

export interface EditFinalItem {
  product: Product;
  productId: string;
  qty: number;
  shelvesId: string;
  wholeSale: number;
  totalPrice: number;
  discount: number;
}

export type SelectedItem = FinalItem & ProductProps;

export interface ReceiptProp {
  invoiceNumber: number;
  branchId: string;
  customerId: string;
  customerLocation: string;
  date: Date;
  paymentType: string;
  finalTotalPrice: number;
  paidDate: Date | null;
  salePerson: string;
  status: boolean;
  receiptItems: FinalItem[];
}

export interface EditReceiptProp {
  id: string;
  invoiceNumber: number;
  branchId: string;
  customerId: string;
  customerLocation: string;
  date: Date;
  paymentType: string;
  finalTotalPrice: number;
  paidDate: Date | null;
  salePerson: string;
  status: boolean;
  receiptItems: EditFinalItem[];
}

export const DEFAULT_RECEIPT: ReceiptProp = {
  branchId: "",
  invoiceNumber: 0,
  customerId: "",
  customerLocation: "",
  date: new Date(),
  paymentType: "",
  finalTotalPrice: 0,
  paidDate: null,
  salePerson: "",
  status: true,
  receiptItems: [],
};

export const DEFAULT_EDITRECEIPT: EditReceiptProp = {
  id: "",
  branchId: "",
  invoiceNumber: 0,
  customerId: "",
  customerLocation: "",
  date: new Date(),
  paymentType: "",
  finalTotalPrice: 0,
  paidDate: null,
  salePerson: "",
  status: true,
  receiptItems: [],
};
