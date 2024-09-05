import React, { useState, useEffect, useMemo } from "react";
import type { Product } from "../products";
import type { EditTransferItem, SelectedItem, TransferItem } from "./";
import { DropList } from "../global/DropList";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { Selectmenu } from "../global/Selectmenu";
import { useProduct } from "../../contexts";
import { useRouter } from "next/router";

interface transferProps {
  editTransferItem?: EditTransferItem[] | undefined;
  restart: boolean;
  onhandleChange: (value: TransferItem[]) => void;
}

const tableHead = [
  "No",
  "Code",
  "Descriptions",
  "Qty",
  "Units",
  "shelf From",
  "shelf To",
  "Remark",
  "",
];

export const Transferlist = (props: transferProps) => {
  const { editTransferItem, restart, onhandleChange } = props;
  const { products } = useProduct();
  const router = useRouter();

  const [selectedItem, setSelectedItem] = useState<SelectedItem[]>([]);
  const [currentDescription, setCurrentDescription] = useState<string>("");
  const [selectDescription, setSelectDescription] = useState<string[]>([]);

  const getQueryValue = (
    value: string | string[] | undefined
  ): string | number | null | undefined => {
    if (typeof value === "string") {
      return value;
    } else if (Array.isArray(value)) {
      return value[0];
    } else {
      return undefined;
    }
  };

  const confirm =
    getQueryValue(router.query.confirm) !== undefined
      ? Number(getQueryValue(router.query.confirm))
      : null;

  const check =
    getQueryValue(router.query.checked) !== undefined
      ? Number(getQueryValue(router.query.checked))
      : null;

  useMemo(() => {
    if (editTransferItem) {
      const editItem = editTransferItem.map((select) => {
        return {
          code: select.product.code,
          description: select.product.description,
          productId: select.product.code,
          qty: select.qty,
          unit: select.product.unit,
          remark: select.remark,
          shelvesFromId: select.shelvesFromId,
          shelvesToId: select.shelvesToId,
        };
      });
      setSelectedItem(editItem);
    }
  }, [editTransferItem]);

  useEffect(() => {
    onhandleChange(selectedItem);
    if (restart) {
      setSelectedItem([]);
      setCurrentDescription("change");
    }
    setCurrentDescription("");
  }, [restart, currentDescription, selectedItem]);

  const handleSelectItem = (item: string, target: string | undefined) => {
    setCurrentDescription(item);
    const createSelectedItem = (select: Product): SelectedItem => {
      return {
        code: select.code,
        description: select.description,
        productId: select.code,
        qty: Number(0),
        unit: select.unit,
        remark: "",
        shelvesFromId: "",
        shelvesToId: "",
      };
    };
    const filterByItem = (
      product: Product,
      item: string,
      target: string | undefined
    ) => {
      (target === "Description" && product.description === item) ||
      (target === "Code" && product.code === item)
        ? selectedItem.push(createSelectedItem(product))
        : null;
    };
    item &&
      products &&
      products.map((product) => filterByItem(product, item, target));

    item &&
      products?.forEach(
        (product) =>
          product.description === item &&
          selectDescription.push(product.description)
      );
  };

  const deleteItem = (id: number) => {
    const removeDescription = (value: string) => {
      const newDescription = selectDescription.filter((item) =>
        item !== value ? item : null
      );
      setSelectDescription(newDescription);
    };

    const newItem = selectedItem.filter((item, idx) =>
      idx !== Number(id) ? item : removeDescription(item.description)
    );

    setSelectedItem(newItem);
  };

  const handleChangeQuantity = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    idx: number
  ) => {
    e.preventDefault();

    const value = e.target.value.trim();

    value.startsWith("0") && value.length > 1
      ? (e.target.value = value.slice(1))
      : e.target.value;

    setSelectedItem((prevItem: SelectedItem[]) => {
      const updateditem = [...prevItem];
      const currentItem = updateditem[idx];
      currentItem
        ? (updateditem[idx] = {
            ...(prevItem[idx] as SelectedItem),
            [e.target.name]:
              e.target.name === "qty" ? Number(e.target.value) : e.target.value,
          })
        : null;

      return updateditem;
    });
    return;
  };

  const handleChangeInput = (value: string, id: string, idx?: number) => {
    idx &&
      setSelectedItem((prevItem: SelectedItem[]) => {
        const updateditem = [...prevItem];
        const currentItem = updateditem[idx - 1];
        currentItem
          ? (updateditem[idx - 1] = {
              ...(prevItem[idx - 1] as SelectedItem),
              [id]: value,
            })
          : null;
        return updateditem;
      });
    return;
  };

  // console.log(selectedItem)

  return (
    <>
      <div className="relative">
        <table className="w-full border border-gray-100 text-left text-sm text-gray-700 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
              {tableHead.map((item, idx) =>
                item !== "shelf To" ? (
                  <th
                    key={idx}
                    scope="col"
                    className={`bg-gray-300 px-3 py-3 text-black`}
                  >
                    {item}
                  </th>
                ) : confirm ? (
                  <th
                    key={idx}
                    scope="col"
                    className={`bg-gray-300 px-3 py-3 text-black`}
                  >
                    {item}
                  </th>
                ) : (
                  check && (
                    <th
                      key={idx}
                      scope="col"
                      className={`bg-gray-300 px-3 py-3 text-black`}
                    >
                      {item}
                    </th>
                  )
                )
              )}
            </tr>
          </thead>
          <tbody>
            {selectedItem.length !== 0 &&
              selectedItem.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b text-gray-600 ${
                    Number(idx % 2) === Number(0) ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <td className="px-3 py-3">{idx + 1}</td>
                  <td className="px-3 py-3">{item.code}</td>
                  <td className="px-3 py-3">{item.description}</td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      id="qty"
                      name="qty"
                      className={`w-12 outline-none ${check || confirm ? "bg-white" : "bg-indigo-200"} ${Number(idx % 2) === Number(0)? "print:bg-white":"print:bg-gray-100"}`}
                      value={selectedItem[idx]?.qty}
                      min={0}
                      onChange={(e) => handleChangeQuantity(e, idx)}
                      disabled={confirm || check ? true : false}
                    />
                  </td>
                  <td className="px-3 py-3">{selectedItem[idx]?.unit}</td>
                  <td className="px-3 py-3 ">
                    {check || confirm ? (
                      <span>{selectedItem[idx]?.shelvesFromId}</span>
                    ) : (
                      <Selectmenu
                        query="shelves"
                        name="shelvesFromId"
                        onhandleChange={handleChangeInput}
                        size="md"
                        initialValue={selectedItem[idx]?.shelvesFromId}
                        index={idx}
                        restart={restart}
                      />
                    )}
                  </td>

                  {check ? (
                    <td className="px-3 py-3 ">
                      <span>{selectedItem[idx]?.shelvesToId}</span>
                    </td>
                  ) : (
                    confirm && (
                      <td className="px-3 py-3 ">
                        <Selectmenu
                          query="shelves"
                          name="shelvesToId"
                          onhandleChange={handleChangeInput}
                          size="md"
                          initialValue={
                            selectedItem[idx]?.shelvesToId !== undefined
                              ? selectedItem[idx]?.shelvesToId
                              : null
                          }
                          index={idx}
                          restart={restart}
                        />
                      </td>
                    )
                  )}

                  <td className="px-3 py-3">
                    <input
                      type="text"
                      id="remark"
                      name="remark"
                      className={`bg-indigo-200 ${
                        check || confirm ? "bg-white" : "bg-indigo-200"
                      } outline-none ${
                        Number(idx % 2) === Number(0)
                          ? "print:bg-white"
                          : "print:bg-gray-100"
                      }`}
                      value={selectedItem[idx]?.remark}
                      min={0}
                      onChange={(e) => handleChangeQuantity(e, idx)}
                    />
                  </td>
                  {
                    check || confirm ? null : <td className="text-center print:hidden">
                    <button
                      className="rounded-full bg-red-500"
                      onClick={() => deleteItem(idx)}
                    >
                      <XMarkIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </td>
                  }
                  
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {check || confirm ? null : selectedItem.length < 10 && (
        <div className="flex bg-white print:hidden">
          <div className="self-center px-3 py-3 text-gray-700">
            {selectedItem.length + 1}
          </div>
          <div className="px-3 py-3">
            <DropList
              items={products}
              target={"Code"}
              onAddDescription={handleSelectItem}
            />
          </div>
          <div className="px-3 py-3">
            <DropList
              items={products}
              target={"Description"}
              onAddDescription={handleSelectItem}
            />
          </div>
        </div>
      )}
    </>
  );
};
