import { type NextPage } from "next";
import React, { useState,useEffect } from "react";
import Link from "next/link";
import { Layout } from "../../components";
import { TransferTable } from "~/components/transfer/TransferTable";

import { api } from '~/utils/api';
import { useBranch } from '~/contexts';
import type { EditTransferProp } from "~/components/transfer";

const title = ["Transfer Unconfirm", "Transfer Confirm"];

const Transfer: NextPage = () => {
  const { branch } = useBranch();
    const { data : transfersByBranch } = api.transfers.getTransferbyBranch.useQuery({
        branchId: branch?.id !== undefined ? branch.id : "",
    });

  const [selected,setSelected] = useState<string>('Transfer Unconfirm');
  const [transferData,setTransferData] = useState<EditTransferProp[]>();

  useEffect (() => {
    if(transfersByBranch !== undefined) {
      if(selected === "Transfer Unconfirm"){
        const unConfirm = transfersByBranch.filter(item => item.confirm === false);
        setTransferData(unConfirm);
      }else if(selected === "Transfer Confirm"){
        const unConfirm = transfersByBranch.filter(item => item.confirm === true);
        setTransferData(unConfirm);
      }
    }
  },[transfersByBranch,selected]);

  const handleChangeTable = (select: string) => {
    setSelected(select);
  }

  return (
    <Layout title="Transfers">
      <div className="mb-10 sm:flex sm:items-center">
        <Link
          href={`transfers/createtransfer`}
          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create Transfer
        </Link>
      </div>
      <ul className="divide-x divide-gray-200 rounded-lg overflow-hidden text-center text-sm font-medium text-gray-500 dark:divide-gray-700 dark:text-gray-400 sm:flex">
        {title.map((label,idx) => (
          <li key={idx} className="w-full">
            <button
              type="button"
              className={`inline-block w-full p-4  outline-none text-white ${selected === label ? 'bg-gray-800' : 'bg-gray-700  shadow hover:bg-gray-500' }`}
              onClick={()=>handleChangeTable(label)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <TransferTable transferInfo={transferData !== undefined ? transferData : []}/>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Transfer;
