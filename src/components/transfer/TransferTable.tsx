import React, { useState, useEffect} from 'react'
import Link from 'next/link';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import type { EditTransferProp } from '.';
import { api } from '~/utils/api';


interface TransferProps{
  transferInfo : EditTransferProp[]
}

const transferTableHead = [ "InvoiceNumber", "Date", "Location From", "Location To", "Confirm", "Action"];

export const TransferTable = (props:TransferProps) => {
  const {transferInfo} = props;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  // const { mutate: deleteTransfer } = api.transfers.deleteByInvoiceNumber.useMutation({});

  // useEffect(() => {
  //   deleteTransfer({ invoiceNumber: 0 });
  //   deleteTransfer({ invoiceNumber: 1 });
  //   deleteTransfer({ invoiceNumber: 2 });
  // }, []);

  return ( 
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {transferTableHead.map((value) => (
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
              {transferInfo?.map((transfer, idx) => (
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
                        {transfer.invoiceNumber}
                      </div>
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {`${(transfer.date.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}/${transfer.date
                        .getDate()
                        .toString()
                        .padStart(2, "0")}/${transfer.date
                        .getFullYear()
                        .toString()}`}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {transfer.warehouseFrom?.name}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {transfer.warehouseTo?.name}
                    </td>
                    <td
                      scope="col"
                      className="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
                    >
                      {transfer.confirm ? (
                        <div className="text-green-500">TRUE</div>
                      ) : (
                        <div className="text-red-300">FALSE</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                      <Link
                        className="mr-5 text-indigo-600 hover:text-indigo-900"
                        href={`/transfers/createtransfer?transferId=${transfer.invoiceNumber}`}
                      >
                        Edit
                      </Link>
                      <Link
                        className="mr-5 text-blue-600 hover:text-indigo-900"
                        href={`/transfers/createtransfer?transferId=${transfer.invoiceNumber}&checked=1`}
                      >
                        Preview
                      </Link>
                      {
                        !transfer.confirm && 
                        <Link
                        className="mr-5 text-green-600 hover:text-green-900"
                        href={`/transfers/createtransfer?transferId=${transfer.invoiceNumber}&confirm=1`}
                      >
                        Confirm
                      </Link>
                      }
                      
                    </td>
                  </tr>
                  {idx === activeIndex && (
                    <tr key={`warehouse-${idx}`}>
                      <td colSpan={Number(6)}>
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
                                        ShelfNoFrom
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                                      >
                                        ShelfNoTo
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500 "
                                      >
                                        Remark
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {transfer.transferItem.map((value, idx) => (
                                      <tr key={idx}>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-800">
                                          {value.productId}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-800">
                                          {value.product.description}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-800">
                                          {value.qty}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-800">
                                          {value.shelvesFrom.name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-800">
                                          {value.shelvesTo?.name}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-800">
                                          {value.remark}
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
  )
};
