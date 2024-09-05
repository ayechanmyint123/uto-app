import React, { useState } from "react";
import { Searchfield } from "./Searchfield";

interface ReceiptFilter {
  invoiceNumber: number;
  date: Date;
  code: string;
  description: string;
  customer: string;
  status: boolean | string;
}
export const RECEIPTFILTER: ReceiptFilter = {
  invoiceNumber: 0,
  date: new Date(),
  code: "",
  description: "",
  customer: "",
  status: "",
};
export const Receiptfilter = () => {
  const [input, setInput] = useState({ ...RECEIPTFILTER });

  const handleChangeValue = (name: string, value: string) => {
    setInput({
      ...input,
      [name]: value,
    });
  };
  return (
    <form action="get">
      <div className="mx-4 my-6 space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Searchfield
              label="invoiceNumber"
              title="Search Invoice"
              id="invoiceNumber"
              type="text"
              onChange={handleChangeValue}
              value={input.invoiceNumber}
              placeholder="Enter Invoice"
            />
          </div>
          <div className="sm:col-span-3">
            <Searchfield
              label="code"
              title="Search Code"
              id="code"
              type="text"
              onChange={handleChangeValue}
              value={input.code}
              placeholder="Enter Code"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <Searchfield
              label="description"
              title="Search Description"
              id="description"
              type="text"
              onChange={handleChangeValue}
              value={input.description}
              placeholder="Enter Description"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <Searchfield
              label="customer"
              title="Search Customer"
              id="customer"
              type="text"
              onChange={handleChangeValue}
              value={input.customer}
              placeholder="Enter Customer"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Searchfield
              label="date"
              title="Search Date"
              id="date"
              type="text"
              onChange={handleChangeValue}
              value={input.date.toLocaleDateString()}
              placeholder="Enter Date"
            />
          </div>
          <div className="sm:col-span-3">
            <Searchfield
              label="status"
              title="Select Status"
              id="status"
              type="select"
              option={[
                {
                  title: "ANY",
                  value: "",
                  select: true,
                },
                {
                  title: "TRUE",
                  value: "true",
                },
                {
                  title: "FALSE",
                  value: "false",
                },
              ]}
              onChange={handleChangeValue}
              value={String(input.status)}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Receiptfilter;
