import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useBranch } from "./BranchContext";
import { DEFAULT_EDITRECEIPT, DEFAULT_RECEIPT,type EditReceiptProp,type ReceiptProp } from "~/components/carts";

interface ReceiptContextProps {
  receipts: ReceiptProp[] | undefined;
  isLoadingReceipts: boolean;
  currentReceipt: ReceiptProp;
  setCurrentReceipt: React.Dispatch<React.SetStateAction<ReceiptProp>>;
  setEditId: React.Dispatch<React.SetStateAction<number | null>>;
  receiptsByBranch: EditReceiptProp[] | undefined;
  editCart: EditReceiptProp | undefined;
}
interface ReceiptProviderProps {
  children: React.ReactElement;
}

// ReceiptContext
const ReceiptContext = createContext({} as ReceiptContextProps);

export const ReceiptProvider = ({ children }: ReceiptProviderProps) => {
  const { branch } = useBranch();

  const [currentReceipt, setCurrentReceipt] = useState(DEFAULT_RECEIPT);
  const [editId, setEditId] = useState<number | null>(null);
  const [editCart,setEditCart] = useState<EditReceiptProp>({...DEFAULT_EDITRECEIPT});

  useEffect(()=>{
    editId && editReceipt !== undefined ? setEditCart(editReceipt) : setEditCart({...DEFAULT_EDITRECEIPT});
  },[editId]);

  const { data: receipts, isLoading: isLoadingReceipts } =
    api.receipts.getAll.useQuery();

  // const queryOptions = { enabled: isEnabled };
  // const { data: editReceipt } = api.receipts.getReceiptsById.useQuery(
  //   {
  //     invoiceNumber: editId !== undefined ? editId : 0,
  //   },
  //   queryOptions
  // );

  
  const { data: receiptsByBranch } = api.receipts.getReceiptsByBranch.useQuery({
    branchId: branch?.id !== undefined ? branch.id : "",
  });

  const editReceipt = editId
    ? receiptsByBranch?.find((item) => item.invoiceNumber === editId && item)
    : undefined;

  const context: ReceiptContextProps = {
    receipts,
    isLoadingReceipts,
    currentReceipt,
    setEditId,
    setCurrentReceipt,
    editCart,
    receiptsByBranch,
  };

  return (
    <ReceiptContext.Provider value={context}>
      {children}
    </ReceiptContext.Provider>
  );
};

export const useReceipt = () => {
  const context = useContext(ReceiptContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a Receipt Provider");
  }
  return {
    ...context,
  };
};
