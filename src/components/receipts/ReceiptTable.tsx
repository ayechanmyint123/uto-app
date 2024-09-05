import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { useBranch } from "~/contexts";
import { api } from "~/utils/api";
import type { EditReceiptProp } from "../carts";

const receiptTableHead = [
  "Invoice",
  "Date",
  "Customer",
  "Cash/Credit",
  "Final Total Price",
  "Paid Date",
  "Status",
  "Action",
];

export const ReceiptTable = () => {
  const { branch } = useBranch();
  const { data: receiptsByBranch } = api.receipts.getReceiptsByBranch.useQuery({
    branchId: branch?.id !== undefined ? branch.id : "",
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [receiptInfo, setReceiptInfo] = useState<EditReceiptProp[]>([]);

  const toggleAccordion = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  useEffect(() => {
    receiptsByBranch !== undefined && setReceiptInfo(receiptsByBranch);
  }, [receiptsByBranch]);

  // Delete a particulat receipt
  // const { mutate: deleteReceipt } =
  //   api.receipts.deleteByInvoiceNumber.useMutation({});

  // useEffect(() => {
  //   deleteReceipt({ invoiceNumber: 0 });
  //   deleteReceipt({ invoiceNumber: 1 });
  //   deleteReceipt({ invoiceNumber: 2 });
  // }, []);

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {receiptTableHead.map((value) => (
                  <th
                    key={value}
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    {value}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {receiptInfo?.map((receipt, idx) => (
                <React.Fragment key={idx}>
                  <tr className="border-t border-gray-300">
                    <td className="flex items-center">
                      <button
                        type="button"
                        className="ml-2"
                        onClick={() => toggleAccordion(idx)}
                      >
                        {activeIndex !== idx ? (
                          <ChevronDownIcon
                            className="mr-3 h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronUpIcon
                            className="mr-3 h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                      <div className="whitespace-nowrap py-5 text-sm">
                        {receipt.invoiceNumber}
                      </div>
                    </td>

                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {`${(receipt.date.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}/${receipt.date
                        .getDate()
                        .toString()
                        .padStart(2, "0")}/${receipt.date
                        .getFullYear()
                        .toString()}`}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {receipt.customerId}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {receipt.paymentType}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      K&nbsp;{receipt.finalTotalPrice}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {receipt.paidDate &&
                        `${(receipt.paidDate.getMonth() + 1)
                          .toString()
                          .padStart(2, "0")}/${receipt.paidDate
                          .getDate()
                          .toString()
                          .padStart(2, "0")}/${receipt.paidDate
                          .getFullYear()
                          .toString()}`}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {receipt.status ? (
                        <div className="text-green-500">TRUE</div>
                      ) : (
                        <div className="text-red-300">FALSE</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                      <Link
                        className="mr-5 text-indigo-600 hover:text-indigo-900"
                        href={`/cart?cartId=${receipt.invoiceNumber}`}
                      >
                        Edit
                      </Link>
                      <Link
                        className="mr-5 text-blue-600 hover:text-blue-900"
                        href={`/cart?cartId=${receipt.invoiceNumber}&checked=true`}
                      >
                        Preview
                      </Link>
                      <Link
                        className=" text-orange-600 hover:text-orange-900"
                        href={`/cart?cartId=${receipt.invoiceNumber}&checked=true`}
                      >
                        Return
                      </Link>
                    </td>
                  </tr>
                  {idx === activeIndex && (
                    <tr key={`warehouse-${idx}`}>
                      <td colSpan={Number(8)}>
                        <div className="flex flex-col px-10 py-3">
                          <div className="overflow-x-auto">
                            <div className="inline-block w-full p-1.5 align-middle">
                              <div className="overflow-hidden rounded-lg border">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                                      >
                                        Code
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                                      >
                                        Description
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                                      >
                                        Qty
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                                      >
                                        Price
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                                      >
                                        Discount
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                                      >
                                        Total Price
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {receipt.receiptItems.map((value, idx) => (
                                      <tr key={idx}>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-800">
                                          {value.productId}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-800">
                                          {value.product?.description}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-800">
                                          {value.qty}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">
                                          K&nbsp;
                                          {value.wholeSale !== 0
                                            ? value.wholeSale
                                            : value.product?.salePrice}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-800">
                                          {value.discount}%
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-800">
                                          K
                                          {value.discount &&
                                          value.discount !== 0
                                            ? value.totalPrice -
                                              value.totalPrice *
                                                (value.discount / 100)
                                            : value.totalPrice}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
