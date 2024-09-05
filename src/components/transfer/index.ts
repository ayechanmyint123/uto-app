import type { Product, Shelf, WareHouse } from "@prisma/client";

export * from "./Transferlist";

export interface ProductProps {
  code: string;
  description: string;
  unit:string;
}

export interface TransferItem {
  productId : string;
  qty : number;
  remark : string;
  shelvesFromId : string;
  shelvesToId ?: string | null | undefined;
}

export interface EditTransferItem {
  product: Product
  productId : string;
  qty : number;
  remark : string;
  shelvesFrom: Shelf;
  shelvesFromId : string;
  shelvesTo?:Shelf | null | undefined;
  shelvesToId ?: string | null | undefined;
}

export type SelectedItem =TransferItem & ProductProps;

export interface TransferProp {
  branchId:string;
  date: Date;
  invoiceNumber : number;
  warehouseFromId :string;
  warehouseToId : string;
  confirm : boolean;
  transferItem: TransferItem[];
}

export interface EditTransferProp {
  id:string;
  branchId:string;
  date: Date;
  invoiceNumber : number;
  warehouseFromId :string;
  warehouseFrom?:WareHouse;
  warehouseToId : string;
  warehouseTo?:WareHouse;
  confirm : boolean;
  transferItem: EditTransferItem[];
}

export const DEFAULT_CREATETRANSFER: TransferProp = {
    branchId: "",
    date: new Date(),
    invoiceNumber : 1,
    warehouseFromId : "",
    warehouseToId : "",
    confirm : false,
    transferItem:[]
  };

export const DEFAULT_EDITTRANSFER: EditTransferProp = {
  id:"",
  branchId: "",
  date: new Date(),
  invoiceNumber : 1,
  warehouseFromId: "",
  warehouseToId: "",
  confirm : false,
  transferItem: []
}

