import React, { useState } from "react";
import { Searchfield } from "./Searchfield";

interface ProductFilter {
  code: string;
  description: string;
  startPrice: number | undefined;
  endPrice: number | undefined;
  status: boolean | string;
}

export const PRODUCTFILTER: ProductFilter = {
  code: "",
  description: "",
  startPrice: undefined,
  endPrice: undefined,
  status: "",
};

export const Productfilter = () => {
  const [input, setInput] = useState({ ...PRODUCTFILTER });

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
              label="code"
              title="Search Field"
              id="code"
              type="text"
              onChange={handleChangeValue}
              value={input.code}
              placeholder="Enter Code"
            />
          </div>
        </div>

        <div>
          <div className="me-14 sm:col-span-3">
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

        <div>
          <span className="font-medium">Price Range</span>
          <div className="grid grid-cols-3 place-items-center gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <Searchfield
                label="startPrice"
                id="startPrice"
                type="number"
                onChange={handleChangeValue}
                value={input.startPrice}
                placeholder="MMK"
              />
            </div>

            <div className="flex items-center justify-center sm:col-span-2">
              <span className="font-medium">To</span>
            </div>

            <div className="sm:col-span-2">
              <Searchfield
                label="endPrice"
                id="endPrice"
                type="number"
                onChange={handleChangeValue}
                value={input.endPrice}
                placeholder="MMK"
              />
            </div>
          </div>
        </div>
        <div>
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
    </form>
  );
};
