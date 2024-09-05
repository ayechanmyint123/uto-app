import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  type FormEvent,
} from "react";
import { type NextPage } from "next";
import Image from "next/image";
import Logo from "../../../public/images/uto-logo.png";

import { Layout, Toast } from "../../components";
import { Selectmenu } from "~/components/global/Selectmenu";
import {
  Cartlist,
  DEFAULT_EDITRECEIPT,
  type FinalItem,
  type EditReceiptProp,
  type ReceiptProp,
} from "~/components/carts";
import { DEFAULT_RECEIPT } from "~/components/carts";

import { useReactToPrint } from "react-to-print";
import { useBranch } from "../../contexts";
import { useRouter } from "next/router";
import { useReceipt } from "~/contexts/ReceiptContext";
import { api } from "~/utils/api";
import { DropList } from "~/components/global/DropList";

const Cart: NextPage = () => {
  const componentRef = useRef(null);
  const router = useRouter();
  const { branch } = useBranch();
  const { receiptsByBranch, editCart, setEditId } = useReceipt();
  const { data: customers } = api.customers.getAll.useQuery();

  const [receipt, setReceipt] = useState({ ...DEFAULT_RECEIPT });
  const [editReceipt, setEditReceipt] = useState<EditReceiptProp>();

  const [subTotal, setSubTotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number | undefined>(0);
  const [finalTotal, setFinalTotal] = useState<number>(0);

  const [restart, setRestart] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState<number>(0);
  const [toastMsg,setToastMsg] = useState({
    toastMsg:'',
    toastTyp:'',
  });

  let cartId: number | null;
  if (typeof router.query.cartId === "string") {
    cartId = Number(router.query.cartId);
  } else if (Array.isArray(router.query.cartId)) {
    cartId = Number(router.query.cartId[0]);
  } else {
    cartId = null;
  }

  let check: string | undefined;
  if (typeof router.query.checked === "string") {
    check = router.query.checked;
  } else if (Array.isArray(router.query.checked)) {
    check = router.query.checked[0];
  }

  useEffect(() => {
    setEditId(cartId);

    if (editCart !== undefined && cartId) {
      receipt.receiptItems = editCart.receiptItems;
      receipt.customerId = editCart.customerId;
      receipt.customerLocation = editCart.customerLocation;
      receipt.salePerson = editCart.salePerson;
      receipt.paymentType = editCart.paymentType;
      setEditReceipt(editCart);
      setDiscount(editCart.receiptItems[0]?.discount);
    } else {
      setReceipt({ ...DEFAULT_RECEIPT });
      setEditReceipt({ ...DEFAULT_EDITRECEIPT });
      setRestart(true);
    }
    branch &&
      setReceipt({
        ...receipt,
        branchId: branch.id,
      });
    setRestart(false);
  }, [cartId, branch, restart, editCart, check]);

  useMemo(() => {
    if (cartId && editCart) {
      setInvoiceNumber(editCart.invoiceNumber);
    } else {
      const receiptLength = receiptsByBranch
        ? receiptsByBranch.length !== 0
          ? Math.max(
              ...receiptsByBranch?.map(
                (item: ReceiptProp) => item.invoiceNumber
              )
            )
          : 0
        : 0;
      setInvoiceNumber(receiptLength + 1);
    }
  }, [receiptsByBranch, editCart, cartId]);

  useMemo(() => {
    const totalPriceList = receipt.receiptItems.map((item) => item.totalPrice);
    const subSum = totalPriceList.reduce(
      (total: number, current: number) => total + current,
      0
    );

    setSubTotal(subSum);
    if (receipt.receiptItems.length === 0) {
      setDiscount(0);
    }
    const finalPrice =
      discount && discount !== 0 ? subSum - subSum * (discount / 100) : subSum;
    setFinalTotal(finalPrice);
  }, [receipt.receiptItems, discount]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setReceipt({
      ...receipt,
      [e.target.name]:
        e.target.name === "date" ? new Date(e.target.value) : e.target.value,
    });
  };

  /* For Customer,Date,Payment */
  // From SelectMenu
  const handleChangeInput = (value: string, id: string) => {
    setReceipt({
      ...receipt,
      [id]: value,
    });
  };

  const handleCartChange = (value: FinalItem[]) => {
    const finalresult = value.map((obj) => ({
      productId: obj.productId,
      qty: obj.qty,
      shelvesId: obj.shelvesId,
      wholeSale: obj.wholeSale,
      totalPrice: obj.totalPrice,
      discount: obj.discount,
    }));

    setReceipt({
      ...receipt,
      receiptItems: finalresult,
    });
  };

  const handleDiscount = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value.trim();
    value.startsWith("0") && value.length > 1
      ? (e.target.value = value.slice(1))
      : e.target.value;

    receipt.receiptItems.map(
      (item: FinalItem) => (item.discount = Number(e.target.value))
    );
    setDiscount(
      Number(e.target.value) > 100 ? Number(100) : Number(e.target.value)
    );
  };

  const handleCancel = () => {
    if (!cartId) {
      setReceipt({ ...DEFAULT_RECEIPT });
      setRestart(true);
    } else {
      void router.push("/receipts");
    }
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

  const createReceiptMutate = api.receipts.create.useMutation({
    onSuccess: () => {
      setToastMsg({
        toastMsg:"Create Receipt Successfully",
        toastTyp:"success"
      })
      setReceipt({ ...DEFAULT_RECEIPT });
      setRestart(true);
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

  const updateReceiptMutate = api.receipts.update.useMutation({
    onSuccess: () => {
      setReceipt({ ...DEFAULT_RECEIPT });
      setRestart(true);
      void router.push("/receipts");
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

  const handleCancelReceipt = () => {
    window.confirm("Are You Sure To Delete This Invoice");
    receipt.paidDate =
      receipt.paymentType === "Cash" ? new Date(receipt.date) : null;
    receipt.finalTotalPrice = finalTotal;
    receipt.invoiceNumber = invoiceNumber;
    receipt.status = false;
    editCart !== undefined &&
      updateReceiptMutate.mutate({
        ...receipt,
        id: editCart.id,
      });
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    receipt.paidDate =
      receipt.paymentType === "Cash" ? new Date(receipt.date) : null;
    receipt.finalTotalPrice = finalTotal;
    receipt.invoiceNumber = invoiceNumber;
    !cartId && handlePrint();
    !cartId
      ? createReceiptMutate.mutate(receipt)
      : editCart !== undefined &&
        updateReceiptMutate.mutate({
          ...receipt,
          id: editCart.id,
        });
  };

  return (
    <Layout title="Cart">
      <Toast errorMsg={toastMsg.toastMsg} errorTyp={toastMsg.toastTyp} onCloseToast={onhandleToast}/>
      <form onSubmit={handleSave}>
        <div className="flex justify-between">
          <div></div>
          <div>
            <button
              type="button"
              onClick={handleCancelReceipt}
              className={`mb-3 mr-3 rounded-lg bg-red-500 px-3 py-2 text-white ${
                cartId ? "" : "hidden"
              }`}
            >
              Cancel Invoice
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={`mb-3 mr-3 rounded-lg bg-orange-500 px-3 py-2 text-white`}
            >
              {cartId ? "Back" : "Restart"}
            </button>
            <button
              type="submit"
              className="mb-3 rounded-lg bg-blue-600  px-3 py-2 text-white"
            >
              {cartId ? "Update" : "Send"}
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
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="mb-3 mr-10 flex">
                <span className="mr-1 text-xl font-semibold text-gray-600">
                  Customer Name :
                </span>
                <DropList
                  items={customers}
                  target="customerId"
                  onAddDescription={handleChangeInput}
                />
              </div>
              <div>
                <span className="text-md mr-1 font-semibold text-gray-600">
                  Location :
                </span>
                <input
                  name="customerLocation"
                  type="text"
                  value={
                    cartId
                      ? editReceipt?.customerLocation
                      : receipt.customerLocation
                  }
                  onChange={handleChange}
                  className="sm:text-md cursor-pointer border-b-4 border-indigo-200 text-left text-gray-900 outline-none sm:leading-6 print:border-0"
                />
              </div>
            </div>

            <div className="">
              <div className="mb-3">
                <span className="mr-1 text-base font-semibold text-gray-600">
                  Invoice Date :
                </span>
                <span className="hidden print:inline">
                  {`${(receipt.date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}/${receipt.date
                    .getDate()
                    .toString()
                    .padStart(2, "0")}/${receipt.date
                    .getFullYear()
                    .toString()}`}
                </span>
                <input
                  type="date"
                  name="date"
                  value={
                    cartId && editReceipt !== undefined
                      ? new Date(editReceipt.date).toISOString().split("T")[0]
                      : new Date(receipt.date).toISOString().split("T")[0]
                  }
                  onChange={handleChange}
                  className="print-hidden-spinner border-b-4 border-indigo-200 outline-none print:hidden"
                />
              </div>
              <div>
                <span className="mr-1 text-base font-semibold text-gray-600">
                  Invoice# :
                </span>
                <span className="tracking-wider">{Number(invoiceNumber)}</span>
              </div>
            </div>
          </div>

          <Cartlist
            editReceiptItem={editCart?.receiptItems}
            restart={restart}
            onhandleChange={handleCartChange}
          />

          <div className="mr-[25px] flex justify-between print:m-0">
            <div className=" w-1/2 py-2">
              <div className="mt-5 flex self-start">
                <span className="font-semibold text-gray-500 ">
                  Cash/Credit :
                </span>
                <Selectmenu
                  menu={[
                    {
                      id: "Cash",
                      name: "Cash",
                    },
                    {
                      id: "Credit-7",
                      name: "Credit-7",
                    },
                    {
                      id: "Credit-14",
                      name: "Credit-14",
                    },
                    {
                      id: "Credit-30",
                      name: "Credit-30",
                    },
                    {
                      id: "Credit-45",
                      name: "Credit-45",
                    },
                  ]}
                  name="paymentType"
                  onhandleChange={handleChangeInput}
                  size="base"
                  initialValue={receipt.paymentType}
                  restart={restart}
                />
              </div>
              <div className="mt-7">
                <span className="font-semibold text-gray-500">
                  Cashier Name :
                </span>
                <input
                  type="text"
                  name="salePerson"
                  value={receipt.salePerson}
                  className="hidden-spinner w-36 bg-indigo-200 px-3 text-left text-gray-700 outline-none print:bg-white"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="text-right print:mr-3">
              <div className="py-2">
                <span className="font-semibold text-gray-500">Sub Total :</span>
                <span className="text-md inline-block w-32 px-1 text-gray-700">
                  {Number(subTotal)}{" "}
                </span>
                <span className="text-gray-500">K</span>
              </div>
              <div className="py-2">
                <span className="font-semibold text-gray-500">Discount :</span>
                <input
                  type="number"
                  value={Number(discount)}
                  disabled={
                    receipt.receiptItems.length === Number(0) ? true : false
                  }
                  className="hidden-spinner w-32 bg-indigo-200 px-1 text-right text-gray-700 outline-none print:bg-white"
                  min={0}
                  max={100}
                  onChange={handleDiscount}
                />
                <span className="text-gray-500">%</span>
              </div>
              <div className="py-2">
                <span className="font-semibold text-gray-500">Total :</span>
                <span className="inline-block w-32 px-1">
                  {Math.ceil(Number(finalTotal))}
                </span>
                <span>K</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default Cart;
