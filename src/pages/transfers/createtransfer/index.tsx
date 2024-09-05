import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  type FormEvent,
} from "react";
import { type NextPage } from "next";
import Image from "next/image";
import Logo from "../../../../public/images/uto-logo.png";

import { Layout, Toast } from "../../../components";
import { Selectmenu } from "~/components/global/Selectmenu";
import { Transferlist } from "~/components/transfer/Transferlist";
import {
  DEFAULT_CREATETRANSFER,
  DEFAULT_EDITTRANSFER,
  type EditTransferProp,
  type TransferItem,
} from "~/components/transfer";

import { useReactToPrint } from "react-to-print";

import { useBranch } from "~/contexts";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const CreateTransferForm: NextPage = () => {
  const componentRef = useRef(null);
  const router = useRouter();
  const { branch } = useBranch();

  

  const [transfer, setTransfer] = useState({ ...DEFAULT_CREATETRANSFER });
  const [editTransfer, setEditTransfer] = useState<EditTransferProp>({
    ...DEFAULT_EDITTRANSFER,
  });
  const [transferTo,setTransferTo] = useState(editTransfer.warehouseToId);
  const [transferFrom,setTransferFrom] = useState(editTransfer.warehouseFromId);

  const [restart, setRestart] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState<number>(0);
  const [toastMsg,setToastMsg] = useState({
    toastMsg:'',
    toastTyp:'',
  });

  const { data: transfersByBranch, isLoading, refetch } =
    api.transfers.getTransferbyBranch.useQuery({
      branchId: branch?.id !== undefined ? branch.id : "",
    });

  const getQueryValue = (value: string | string[] | undefined): string | number | null | undefined => {
    if (typeof value === "string") {
      return value;
    } else if (Array.isArray(value)) {
      return value[0];
    } else {
      return undefined;
    }
  }

  const transferId = getQueryValue(router.query.transferId) !== undefined
  ? Number(getQueryValue(router.query.transferId))
  : null;

const confirm = getQueryValue(router.query.confirm) !== undefined
  ? getQueryValue(router.query.confirm)
  : null;

  const check = getQueryValue(router.query.checked) !== undefined
  ? getQueryValue(router.query.checked)
  : null;

  useEffect(() => {
    if (transfersByBranch !== undefined && transferId) {

      const editTransferfilter = transferId
        ? transfersByBranch?.find((item : EditTransferProp) => item.invoiceNumber === transferId && item)
        : undefined;
      transfer.transferItem = editTransfer.transferItem;
      transfer.warehouseFromId = editTransfer.warehouseFromId;
      transfer.warehouseToId = editTransfer.warehouseToId;
      editTransferfilter !== undefined && setEditTransfer(editTransferfilter);
    }

    branch &&
      setTransfer({
        ...transfer,
        branchId: branch.id,
      });
    setRestart(false);
  }, [branch, restart,transfersByBranch,transferId]);

  useMemo(() => {
    if (transferId && editTransfer) {
      setInvoiceNumber(editTransfer.invoiceNumber);
    } else {
      const transferLength = transfersByBranch
        ? transfersByBranch.length !== 0
          ? Math.max(...transfersByBranch?.map((item) => item.invoiceNumber))
          : 0
        : 0;
      setInvoiceNumber(transferLength + 1);
    }
  },[transfersByBranch, editTransfer, transferId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setTransfer({
      ...transfer,
      [e.target.name]:
        e.target.name === "date" ? new Date(e.target.value) : e.target.value,
    });
  };

  const handleChangeInput = (val: string, id: string) => {
    setTransfer({
      ...transfer,
      [id]: val,
    });
  };

  const handleTransferChange = (value: TransferItem[]) => {
    const finalresult = value.map((obj) => ({
      productId: obj.productId,
      shelvesFromId: obj.shelvesFromId,
      shelvesToId: obj.shelvesToId !== undefined ? obj.shelvesToId : null,
      qty: obj.qty,
      remark: obj.remark,
    }));

    setTransfer({
      ...transfer,
      transferItem: finalresult,
    });
  };

  const onhandleToast = (value : string) => {
    setToastMsg({
      ...toastMsg,
      toastTyp: value,
    })
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const createTransferMutate = api.transfers.create.useMutation({
    onSuccess: () => {
      setToastMsg({
        toastMsg:"Create Receipt Successfully",
        toastTyp:"success"
      })
      setTransfer({ ...DEFAULT_CREATETRANSFER });
      setRestart(true);
      refetch().catch((error) => {
        // Handle the error here
        console.error('Error occurred while fetching data:', error);
      });
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        console.log(errorMessage[0]);
      } else {
        console.log("Failed to create! Please try again later.");
      }
    },
  });

  const updateTransferMutate = api.transfers.update.useMutation({
    onSuccess:() => {
      console.log("finish");
      setTransfer({ ...DEFAULT_CREATETRANSFER });
      setRestart(true);
      void router.push('/transfers')
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        console.log(errorMessage[0]);
      } else {
        console.log("Failed to create! Please try again later.");
      }
    },
  });

  const handleCancel = () => {
    
    if(!transferId){
      setTransfer({ ...DEFAULT_CREATETRANSFER });
      setRestart(true);
    } else{
      void router.push("/transfers");
    }
   
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    transfer.invoiceNumber = invoiceNumber;
    const transferTo = confirm ? transfer.transferItem.filter(item => item.shelvesToId === '' || item.shelvesToId === undefined || item.shelvesToId === null) : [];
    !transferId && handlePrint();
    !transferId ? createTransferMutate.mutate({
      ...transfer,
      transferItem: transfer.transferItem.map(item => ({...item, shelvesToId:item.shelvesToId === undefined ? item.shelvesToId = null : item.shelvesToId}))
    })
    : editTransfer !== undefined &&
      updateTransferMutate.mutate({
        ...transfer,
        id:editTransfer.id,
        confirm: confirm && transferTo.length ===  0 ? true : false,
        transferItem: transfer.transferItem.map(item => ({...item, shelvesToId:item.shelvesToId === undefined ? item.shelvesToId = null : item.shelvesToId}))
      })
  };

  console.log(transfersByBranch)

  return (
    <Layout title="Create Transfer Form">
      <Toast errorMsg={toastMsg.toastMsg} errorTyp={toastMsg.toastTyp} onCloseToast={onhandleToast}/>
      <form onSubmit={handleSave}>
        <div className="flex justify-between">
          <div></div>
          <div>
            <button
              type="button"
              onClick={handleCancel}
              className="mb-3 mr-3 rounded-lg bg-orange-500 px-3 py-2 text-white"
            >
              {transferId ? "Back" : "Restart"}
            </button>
            <button
              type="submit"
              className="mb-3 rounded-lg bg-indigo-600 px-3 py-2 text-white"
            >
              {transferId ? confirm ? "Confirm" :"Update" : "Send"}
            </button>
          </div>
        </div>

        <div ref={componentRef} className="w-full bg-white p-4">
          <div className="mb-3 flex justify-between">
            <div>
              <h1 className="mb-3 text-2xl font-semibold text-red-500">
                U Than Ohn & Sons (YGN Tools Shop)
              </h1>
              <div className="text-sm font-semibold leading-7">
                <p className="">No.105,Shwedagon Pagoda Rd.</p>
                <p>Latha Township,Yangon</p>
                <p>(+951)204021,95-1-378956,378928</p>
                <a href="#" className="underline">
                  www.utotools.com
                </a>
              </div>
            </div>
            <div className="block">
              <Image
                src={Logo.src}
                className="object-cover"
                width={128}
                height={128}
                alt=""
              />
            </div>
          </div>
          <div className="mb-3 flex justify-between">
            <div>
              <div className="mb-3 flex ">
                <span className="mr-1 text-xl font-semibold text-gray-600">
                  Location From :
                </span>
                {
                  check || confirm ? <span className="mt-auto">{editTransfer.warehouseFrom?.name}</span>
                  :
                  <Selectmenu
                    query="wareHouse"
                    name="warehouseFromId"
                    onhandleChange={handleChangeInput}
                    size="xl"
                    initialValue={editTransfer.warehouseFrom?.name}
                    restart={restart}
                  />
                } 
              </div>
              <div className="mb-3 flex">
                <span className="mr-1 text-xl font-semibold text-gray-600">
                  Location To :
                </span>
                {
                  check || confirm ? <span className="mt-auto">{editTransfer.warehouseTo?.name}</span>
                  :
                <Selectmenu
                  query="wareHouse"
                  name="warehouseToId"
                  onhandleChange={handleChangeInput}
                  size="xl"
                  initialValue={editTransfer.warehouseTo?.name}
                  restart={restart}
                />
                }
              </div>
            </div>
            <div className="">
              <div className="mb-3">
                <span className="mr-1 text-xl font-semibold text-gray-600">
                  Invoice Date :
                </span>
                <span className={`${check || confirm  ? 'inline' : 'hidden'} print:inline`}>
                  {`${(transfer.date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}/${transfer.date
                    .getDate()
                    .toString()
                    .padStart(2, "0")}/${transfer.date
                    .getFullYear()
                    .toString()}`}
                </span>
                {
                  check || confirm  ? null : <input
                  type="date"
                  name="date"
                  value={
                    transferId && editTransfer !== undefined
                      ? new Date(editTransfer.date).toISOString().split("T")[0]
                      : new Date(editTransfer.date).toISOString().split("T")[0]
                  }
                  disabled = {check ? true : false}
                  onChange={handleChange}
                  className="print-hidden-spinner border-b-4 border-indigo-200 outline-none print:hidden"
                />
                }
              </div>
              <div>
                <span className="mr-1 text-xl font-semibold text-gray-600">
                  Invoice# :
                </span>
                <span className="tracking-wider">{Number(invoiceNumber)}</span>
              </div>
            </div>
          </div>

          <Transferlist
            editTransferItem={editTransfer?.transferItem}
            restart={restart}
            onhandleChange={handleTransferChange}
          />
        </div>
      </form>
    </Layout>
  );
};

export default CreateTransferForm;
