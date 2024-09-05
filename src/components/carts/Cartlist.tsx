/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";

import type { EditFinalItem, FinalItem, ProductProps, SelectedItem } from ".";
import { DropList } from "../global/DropList";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Selectmenu } from "../global/Selectmenu";
import { useProduct, useShelves } from "~/contexts";

interface ShelveArrayProp {
  id: string;
  name: string;
}

interface CartProp {
  editReceiptItem?: EditFinalItem[] | undefined;
  restart: boolean;
  onhandleChange: (val: SelectedItem[]) => void;
}

const tableHead = [
  "No",
  "Code",
  "Description",
  "Location",
  "Qty",
  "Unit",
  "Sale Price",
  "Whole Sale",
  "Price",
  "Total Price",
  " ",
];

export const Cartlist = (props: CartProp) => {
  const { editReceiptItem, restart, onhandleChange } = props;
  const { products } = useProduct();
  const { shelves } = useShelves();

  const [selectedItem, setSelectedItem] = useState<SelectedItem[]>([]);
  const [currentDescription, setCurrentDescription] = useState<string>("");
  const [selectDescription, setSelectDescription] = useState<string[]>([]);
  const [shelfArray, setShelfArray] = useState<ShelveArrayProp[]>([]);

  useMemo(() => {
    if (editReceiptItem) {
      const editItem = editReceiptItem.map((select) => {
        return {
          productId: select.product?.code,
          shelvesId: select.shelvesId,
          code: select.product?.code,
          description: select.product?.description,
          qty: select.qty,
          unit: select.product?.unit,
          salePrice: select.product?.salePrice,
          wholeSale: select.wholeSale,
          totalPrice: select.totalPrice,
          discount: select.discount,
        };
      });
      setSelectedItem(editItem);
    }
  }, [editReceiptItem]);

  useEffect(() => {
    onhandleChange(selectedItem);
    if (restart) {
      setSelectedItem([]);
      setCurrentDescription("change");
    }
    setCurrentDescription("");

    const shelvesArray = shelves?.map((shelf) => {
      return {
        id: shelf.name,
        name: shelf.name,
      };
    });
    shelvesArray !== undefined
      ? setShelfArray(shelvesArray)
      : setShelfArray([]);
  }, [restart, currentDescription, selectedItem, editReceiptItem, shelves]);

  const handleSelectItem = (item: string, target: string | undefined) => {
    /* For State Update when choose Cart Item */
    setCurrentDescription(item);
    const createSelectedItem = (select: ProductProps): SelectedItem => {
      return {
        productId: select.code,
        shelvesId: "",
        code: select.code,
        description: select.description,
        qty: Number(0),
        unit: select.unit,
        salePrice: select.salePrice,
        wholeSale: Number(0),
        totalPrice: Number(0),
        discount: Number(0),
      };
    };
    const filterByItem = (
      product: ProductProps,
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
      idx !== Number(id)
        ? item
        : item.description !== undefined && removeDescription(item.description)
    );

    setSelectedItem(newItem);
  };

  const handleChangePrice = (
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
            [e.target.name]: Number(e.target.value),
            totalPrice:
              e.target.name === "qty"
                ? currentItem.wholeSale !== Number(0) &&
                  currentItem.wholeSale !== Number("")
                  ? Number(currentItem.wholeSale * Number(e.target.value))
                  : Number(
                      currentItem.salePrice !== undefined &&
                        currentItem.salePrice * Number(e.target.value)
                    )
                : e.target.value !== ""
                ? Number(currentItem.qty) * Number(e.target.value)
                : Number(currentItem.qty) * Number(currentItem.salePrice),
          })
        : null;

      return updateditem;
    });
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

  return (
    <>
      <div>
        <table className="w-full border border-gray-100 text-left text-sm text-gray-700 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {tableHead.map((item, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`bg-gray-300 px-3 py-3 text-black
                            ${
                              item === "Whole Sale" ||
                              item === "Sale Price" ||
                              item === "Location" ||
                              item === " "
                                ? "print:hidden"
                                : ""
                            } 
                            ${item === "Total Price" ? "text-right" : ""}
                            `}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedItem.length !== 0 &&
              selectedItem.map((item, idx) => (
                <tr
                  key={idx}
                  className={`relative border-b text-gray-600 ${
                    Number(idx % 2) === Number(0) ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <td className="px-3 py-3">{idx + 1}</td>
                  <td className="px-3 py-3">{item.code}</td>
                  <td className="px-3 py-3">{item.description}</td>
                  <td className="px-3 py-3 print:hidden">
                    <Selectmenu
                      menu={shelfArray}
                      initialValue={item.shelvesId}
                      name="shelvesId"
                      onhandleChange={handleChangeInput}
                      index={idx}
                      size="md"
                      restart={restart}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      id="qty"
                      name="qty"
                      className={`w-12 bg-indigo-200 outline-none ${
                        Number(idx % 2) === Number(0)
                          ? "print:bg-white"
                          : "print:bg-gray-100"
                      }`}
                      value={item.qty}
                      min={0}
                      onChange={(e) => handleChangePrice(e, idx)}
                    />
                  </td>
                  {/* change */}
                  <td className="px-3 py-3">{item.unit}</td>
                  <td className="px-3 py-3 print:hidden">{item.salePrice}</td>
                  <td className="px-3 py-3 print:hidden">
                    <input
                      type="number"
                      id="wholeSale"
                      name="wholeSale"
                      className="w-28  bg-indigo-200 outline-none"
                      min={0}
                      value={item.wholeSale}
                      onChange={(e) => handleChangePrice(e, idx)}
                    />
                  </td>
                  <td className="px-3 py-3">
                    {item.wholeSale === Number(0)
                      ? item.salePrice
                      : item.wholeSale}
                  </td>
                  <td className="px-3 py-3 text-right">{item.totalPrice} K</td>
                  <td className="text-center print:hidden">
                    <button
                      type="button"
                      className="rounded-full bg-red-500"
                      onClick={() => deleteItem(idx)}
                    >
                      <XMarkIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {selectedItem.length < 15 && (
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
